const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { transport, emailTemplate } = require("../mail");
const { checkIfLoggedIn } = require("../utils");

const Mutation = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    email = email.toLowerCase();

    const user = await ctx.db.query.user({
      where: {
        email
      }
    });

    if (!user) throw new Error(`No user found for email ${email}`);

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");

    return { message: "Signed out" };
  },

  async requestReset(parent, { email }, ctx, info) {
    email = email.toLowerCase();

    const user = await ctx.db.query.user({ where: { email } });

    if (!user) throw new Error(`No user found for email ${email}`);

    const randomBytesPromise = await promisify(randomBytes)(20);
    const resetToken = randomBytesPromise.toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    await transport.sendMail({
      from: `webm@${process.env.FRONTEND_URL}`,
      to: email,
      subject: "Your password reset",
      html: emailTemplate(`
        Click <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">here</a> to reset your password
      `)
    });

    return { message: "Password reset email sent" };
  },

  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;

    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) throw new Error("This token is either invalid or expired");

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { email: user.email },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      },
      info
    );

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return updatedUser;
  },

  async createChallenge(parent, { participantEmail, title, goal }, ctx, info) {
    checkIfLoggedIn(ctx);

    const challenger = await ctx.db.query.user({
      where: { id: ctx.request.userId }
    });

    if (!challenger) throw new Error(`Challenger does not exist`);

    const participant = await ctx.db.query.user({
      where: { email: participantEmail }
    });

    if (!participant)
      throw new Error(`${participantEmail} is not a registered user`);

    return ctx.db.mutation.createChallenge(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          participant: {
            connect: {
              email: participantEmail
            }
          },
          title,
          goal
        }
      },
      info
    );
  },

  async createResult(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    const user = await ctx.db.query.user({
      where: {
        id: ctx.request.userId
      }
    });

    if (!user) throw new Error("User does not exist");

    const winner = await ctx.db.query.user({
      where: {
        id: args.winnerId
      }
    });

    if (!winner) throw new Error("Winner does not exist");

    const loser = await ctx.db.query.user({
      where: {
        id: args.loserId
      }
    });

    if (!loser) throw new Error("Loser does not exist");

    const result = await ctx.db.mutation.createResult(
      {
        data: {
          challenge: { connect: { id: args.challengeId } },
          createdBy: { connect: { id: ctx.request.userId } },
          winner: { connect: { id: args.winnerId } },
          loser: { connect: { id: args.loserId } }
        }
      },
      info
    );

    return result;
  },

  async deleteResult(parents, { id }, ctx, info) {
    checkIfLoggedIn(ctx);

    const user = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      `{ id }`
    );

    const result = await ctx.db.query.result(
      { where: { id } },
      `{ createdBy { id } }`
    );

    if (user.id !== result.createdBy.id) {
      throw new Error("You did not create this so you can not delete it");
    } else {
      return ctx.db.mutation.deleteResult({ where: { id } }, info);
    }
  },

  async confirmResult(parents, { id }, ctx, info) {
    checkIfLoggedIn(ctx);

    const user = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      `{ id }`
    );

    const result = await ctx.db.query.result(
      { where: { id } },
      `{ createdBy { id } }`
    );

    if (user.id === result.createdBy.id) {
      throw new Error("You can not confirm your own result");
    } else {
      return ctx.db.mutation.updateResult(
        { where: { id }, data: { confirmed: true } },
        info
      );
    }
  }
};

module.exports = Mutation;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

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

    return { message: "Password reset email sent" };
  }
};

module.exports = Mutation;

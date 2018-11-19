const { checkIfLoggedIn } = require("../utils");

const Query = {
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
  },

  async challenge(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    const challenge = await ctx.db.query.challenge(
      {
        where: {
          id: args.id
        }
      },
      info
    );

    if (!challenge) throw new Error("Oops! That challenge does not exist");

    const canAccessChallenge = [
      challenge.user.id,
      challenge.participant.id
    ].some(val => val === ctx.request.userId);

    if (!canAccessChallenge)
      throw new Error("You are not participating in this challenge");

    return challenge;
  },

  async challenges(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    const challenges = await ctx.db.query.challenges(
      {
        where: {
          OR: [
            {
              user: { id: ctx.request.userId }
            },
            {
              participant: { id: ctx.request.userId }
            }
          ]
        }
      },
      info
    );

    return challenges;
  }
};

module.exports = Query;

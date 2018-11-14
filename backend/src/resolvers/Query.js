const { checkIfLoggedIn } = require("../utils");

const Query = {
  me(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    return ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
  }
};

module.exports = Query;

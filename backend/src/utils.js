function checkIfLoggedIn(ctx) {
  if (!ctx && !ctx.request && !ctx.request.userId)
    throw new Error("You are not logged in.");

  return true;
}

module.exports = { checkIfLoggedIn };

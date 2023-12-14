const checkPermission = (role) => {
  return (req, res, next) => {
    let user = req.authUser;
    if (typeof role === "string" && user.role === role) {
      next();
    } else if (Array.isArray(role) && role.includes(user.role)) {
      next();
    } else {
      next({
        status: 403,
        msg: "You do not have previlege to access this request",
      });
    }
  };
};

module.exports = { checkPermission };

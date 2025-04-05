exports.requireRole = (role) => {
  return (req, res, next) => {
    console.log("🧪 Role Check: ", req.user?.role, "Required:", role);
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Forbidden: Incorrect role" });
    }
    next();
  };
};
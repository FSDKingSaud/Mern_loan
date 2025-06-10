const Role = require("../models/Role");

const getUserRole = async (user) => {
  const userRole = await Role.findOne({ _id: user.userRole });
  if (!userRole) throw new Error("User Role not found");
  return userRole;
};

module.exports = {
  getUserRole,
};

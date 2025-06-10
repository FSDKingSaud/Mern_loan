// Define a function to handle adminRoles
const handleAdminRoles = (user, setAdminRoles) => {
  if (user?.userRole?.can?.length > 1) {
    setAdminRoles(user?.userRole?.can);
  }
};

export default handleAdminRoles;

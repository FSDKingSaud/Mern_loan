const jwt = require("jsonwebtoken");
const User = require("../models/AdminUser");
const Customer = require("../models/Customer");

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await User.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist
    if (!user) {
      user = await Customer.findOne({
        _id: decoded.user_id,
        username: decoded.username,
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const authenticateStaffToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await User.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const authenticateCustomerToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await Customer.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const verifyAdminInactivity = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    if (decoded.isAdmin) {
      const now = Date.now();
      const issuedAt = decoded.iat * 1000; // Convert seconds to ms

      if (now - issuedAt > ADMIN_REFRESH_TIMEOUT) {
        res.clearCookie("jwt");
        return res.status(403).json({ error: "Session expired due to inactivity" });
      }
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};




module.exports = {
  authenticateToken,
  authenticateCustomerToken,
  authenticateStaffToken,
  verifyAdminInactivity
}; // export middleware

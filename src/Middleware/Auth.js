const jwt = require("jsonwebtoken");
const asyncHandler = require("../Helpers/AsyncHandler");
const ErrorResponse = require("../Helpers/errorResponse");
const User = require("../Models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.cookie) {
    token = req.headers.cookie.slice(6, req.headers.cookie.length);
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.type);
    if (!roles.includes(req.user.type)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.type} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

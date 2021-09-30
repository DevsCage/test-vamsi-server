const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

const Admin = require("../models/authAdminModel");
const catchAsyncErrors = require("./catchAsyncErrors");

// exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("Login first to access this resource", 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decoded.id);

//   next();
// });

exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  if (!token) {
    // return next(new ErrorHandler("Login first to access this resource", 401));
    return res
      .status(401)
      .json({ message: "Login first to access this resource" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Admin.findById(decoded.id);

  next();
});

//Handling authorized rol;es

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:  ${req.user.role}is not allowed to access this resoruce`,
          403
        )
      );
    }
    next();
  };
};

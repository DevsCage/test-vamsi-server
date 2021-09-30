const { check, validationResult } = require("express-validator");

exports.validatorSignUp = [
  check("firstName").notEmpty().withMessage("FirstName is Required"),
  check("lastName").notEmpty().withMessage("LastName is Required"),
  check("email").isEmail().withMessage("Valid Email is Required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be Mininum 6 Character"),
  check("contactNumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("Please provide a valid Phone Number"),
];

exports.validatorSignIn = [
  // check('email').isEmail().withMessage('Valid Email is Required'),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be Mininum 6 Character"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.array().length > 0) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  next();
};

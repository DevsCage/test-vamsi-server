const express = require("express");
const router = express.Router();

const {
  isRequestValidated,
  validatorSignUp,
  validatorSignIn,
} = require("../validators/auth");
const {
  // signup,
  // signin,
  requireSigninAsAdmin,
  requireSigninAsStudent,
  AllLogout,
} = require("../controller/authController");
const {
  studentSignin,
  resetPassword,
} = require("../controller/studentAuthController.js");

const { adminSignin } = require("../controller/authController");
const { adminSignUp } = require("../controller/authController");
const { isAuthenticatedAdmin, authorizeRoles } = require("../middleware/auth");
const {
  accountantSignUp,
  accountantSignin,
} = require("../controller/accountantAuthController");
const {
  facultySignUp,
  facultySignin,
} = require("../controller/facultyAuthController");

// router.post("/signup", validatorSignUp, isRequestValidated, signup);
// router.post("/signin", validatorSignIn, isRequestValidated, signin);
router.post("/student/signin", studentSignin);
router.post("/logout", AllLogout);
router.post(
  "/admin/login",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),
  adminSignin
);
router.post("/reset-password-stud-fw-usn", resetPassword);
router.post(
  "/admin/testRoute",
  // isAuthenticatedAdmin,
  // authorizeRoles("admin"),
  function (req, res) {
    res.cookie("etst", "ahbjhcbd");
    res.send("cocokie sent");
  }
);

router.post("/admin/signin", adminSignin);
router.post("/admin/signup", adminSignUp);
router.get("/admin/profile", requireSigninAsAdmin, (req, res) => {
  res.status(200).json({ message: "student" });
});

// accountant route
// @desc accountant sign up
router.post("/accountant/signup", accountantSignUp);

// accountant login route
// @desc accountant login
router.post("/accountant/login", accountantSignin);

// faculty route
// @desc faculty sign up
router.post("/faculty/signup", facultySignUp);

// faculty login route
// @desc faculty login
router.post("/faculty/login", facultySignin);

// router.get("/student/profile", requireSigninAsStudent, (req, res) => {
//   res.status(200).json({ message: "admin" });
// });

module.exports = router;

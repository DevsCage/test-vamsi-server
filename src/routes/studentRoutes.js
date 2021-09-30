const express = require("express");
const path = require("path");
const {
  createStudent,
  getAllStudents,
  findStudentDelete,
  getStudentByID,
  getStudents,
  updateStudents,
  getStudentByUSN,
  ResetPasswordOTP,
  StudentBatchUpdate,
  addStudentUser,
  getStudentForExamFeeOneUpdate,
  getStudentsForStudentProfile,
  getStudentDeatilsByID,
} = require("../controller/studentController");
const router = express.Router();
const multer = require("multer");
const { isAuthenticatedAdmin, authorizeRoles } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/students/create",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),
  upload.single("stud_photo"),
  createStudent
);
router.get(
  "/students/get-student",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),
  getAllStudents
);
router.delete(
  "/students/delete-student/:id",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),
  findStudentDelete
);
router.post(
  "/get-student-by-ID",
  // isAuthenticatedAdmin,
  // authorizeRoles("admin"),
  getStudentByID
);
router.post(
  "/get-students",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),
  getStudents
);
router.post(
  "/update-student",
  isAuthenticatedAdmin,
  authorizeRoles("admin"),

  updateStudents
);
router.post("/promote-students-many", StudentBatchUpdate);
router.post("/get-student-by-USN", getStudentByUSN);
router.post("/reset-password-fwd-otp", ResetPasswordOTP);
router.post("/add-new-student-user", addStudentUser);
router.post("/get-students-for-profile", getStudentsForStudentProfile);
router.post("/get-student-for-profile-admin", getStudentDeatilsByID);
module.exports = router;

const express = require("express");

const {
  addUniversityFee,
  getStudentForUniversityFeeOneUpdate,
  updateUniversityFeesOne,
  getUniversityFeeForUpdateMany,
  updateExistingUniversityFeeMany,
  getUniversityFeeforStudent,
} = require("../controller/universityFeeController");

const router = express.Router();

router.post("/add-university-fee", addUniversityFee);
router.post("/update-university-fee-one", updateUniversityFeesOne);
router.post("/get-student-university-fee", getStudentForUniversityFeeOneUpdate);
router.post("/get-university-fee-update-many", getUniversityFeeForUpdateMany);
router.post("/university-fee-update-many", updateExistingUniversityFeeMany);
router.post("/get-university-fee-for-students", getUniversityFeeforStudent);

module.exports = router;

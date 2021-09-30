const express = require("express");
const {
  addExamFee,
  updateExistingExamFeeMany,
  getStudentForExamFeeOneUpdate,
  getFeeForUpdateMany,
  getExamFeeforStudent,
  updateExamFeeOne,
} = require("../controller/examFeeController");
const router = express.Router();

router.post("/add-exam-fee", addExamFee);
router.post("/update-exam-fee-many", updateExistingExamFeeMany);
router.post("/get-students-examfee-update-one", getStudentForExamFeeOneUpdate);
router.post("/get-fee-for-update-many", getFeeForUpdateMany);
router.post("/get-exam-fee-for-student", getExamFeeforStudent);
router.post("/update-exam-fee-one", updateExamFeeOne);
module.exports = router;

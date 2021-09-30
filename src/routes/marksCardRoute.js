const express = require("express");

const {
  addMarksCard,
  getMarksCardForStudents,

  getSemMarksCardFaculty,
  updateMarkCard,
} = require("../controller/marksCardController");

const router = express.Router();

router.post("/addmarks-card", addMarksCard);
router.post("/get-marks-students", getMarksCardForStudents);
router.post("/get-marks-faculty", getSemMarksCardFaculty);
router.post("/update-markscard", updateMarkCard);
module.exports = router;

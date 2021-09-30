const express = require("express");
const router = express.Router();

const { getCourses, addCourse } = require("../controller/coursesController");

router.get("/course/getcourse", getCourses);
router.post("/add-course", addCourse);
module.exports = router;

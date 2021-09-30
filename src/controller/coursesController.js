const Courses = require("../models/courseModel");

exports.addCourse = async (req, res) => {
  const addcourse = req.body;

  const course = await new Courses(addcourse);
  console.log(addcourse);
  course.save();
};
exports.getCourses = async (req, res) => {
  try {
    const allCourses = await Courses.find();
    res.status(200).json(allCourses);
  } catch (error) {
    res.status(400).json({
      message: "Fetching from Database failed!",
    });
  }
};

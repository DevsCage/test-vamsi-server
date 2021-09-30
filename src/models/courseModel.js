const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    course_id: {
      type: String,
    },
    course_name: {
      type: String,
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Courses", courseSchema);

module.exports = courseModel;

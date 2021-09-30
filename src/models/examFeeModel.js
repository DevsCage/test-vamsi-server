const mongoose = require("mongoose");

const examFeeSchema = new mongoose.Schema({
  stud_reg_num: {
    type: String,
  },
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  stud_fname: { type: String },
  stud_lname: { type: String },
  stud_branch: { type: String },
  stud_section: { type: String },
  academic_year: { type: String },
  stud_branch_year: {
    type: String,
  },
  stud_semister: { type: String },

  stud_exam_fee: { type: Number },
  stud_exam_supplimentary_fee: {
    type: Number,
  },
  paymentStatus: { type: String, default: "Not Paid" },
});

const ExamFeeModel = mongoose.model("Student_Exam_Fee", examFeeSchema);

module.exports = ExamFeeModel;

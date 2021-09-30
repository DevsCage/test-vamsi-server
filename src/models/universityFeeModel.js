const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  stud_reg_num: {
    type: String,
  },
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  stud_fname: { type: String },
  stud_lname: { type: String },
  stud_section: { type: String },
  stud_branch: { type: String },
  academic_year: { type: String },
  stud_branch_year: {
    type: String,
  },
  stud_semister: { type: String },
  stud_university_fee: { type: Number },
  stud_university_other_fee: {
    type: Number,
  },
  paymentStatus: { type: String, default: "Not Paid" },
});

const universityFeeModel = mongoose.model(
  "student_university_fee",
  universitySchema
);

module.exports = universityFeeModel;

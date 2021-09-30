const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const studentSchema = mongoose.Schema(
  {
    stud_fname: {
      type: String,
      trim: true,
    },
    stud_lname: {
      type: String,
    },
    stud_fullName: { type: String },
    stud_reg_num: {
      type: String,
    },
    stud_adharno: { type: String },

    stud_academic_year: { type: String },
    stud_branch_year: { type: String },
    stud_caste: { type: String },
    stud_religion: { type: String },
    stud_subcaste: { type: String },
    stud_section: { type: String },
    stud_semister: { type: String },
    stud_branch: { type: String },
    stud_qouta: { type: String },
    stud_cat: { type: String },
    stud_contact_no: { type: String },
    stud_dob: {
      type: String,
      trim: true,
    },
    stud_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    stud_address: {
      type: String,
      trim: true,
    },
    stud_city: {
      type: String,
    },
    stud_state: {
      type: String,
    },
    stud_zip: {
      type: Number,
    },
    stud_gender: {
      type: String,
      trim: true,
    },
    stud_photo: {
      image: { type: Buffer },
      contentType: { type: String },
    },
  },
  { timestamps: true }
);

studentSchema.virtual("fullName", function () {
  return `${stud_fname} ${stud_lname}`;
});

studentSchema.virtual("password").set(function (stud_sys_init_password) {
  this.stud_sys_init_password = bcrypt.hashSync(stud_sys_init_password, 15);
});

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;

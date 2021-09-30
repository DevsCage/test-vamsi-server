const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    stud_reg_num: {
      type: String,
    },
    stud_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    stud_fname: { type: String },
    stud_lname: { type: String },
    stud_branch: {
      type: String,
    },
    stud_section: {
      type: String,
    },
    stud_academic_year: [
      {
        academic_year: { type: String },
        stud_branch_year: {
          type: String,
        },

        stud_tution_fee: { type: Number },
        stud_addmission_fee: { type: Number },
        stud_sports_fee: {
          type: Number,
        },
        stud_lab_fee: {
          type: Number,
        },
        stud_transportation_fee: {
          type: Number,
        },
        stud_other_fee: {
          type: Number,
        },
        stud_other_fee_description: {
          type: String,
        },
        stud_hostel_fee: { type: Number },
        stud_total_fee: {
          type: Number,
        },
        stud_pending_fee: { type: Number },
        stud_paid_fee: {
          type: Number,
        },
      },
    ],
    // stud_payment_list: [
    //   {
    //     feePaid: {
    //       type: Number,
    //       required: true,
    //     },
    //     date: {
    //       type: String,
    //       default: Date,
    //     },
    //     payment_mode: {
    //       type: String,
    //       required: true,
    //       enum: ["online", "cash", "cheque", "dd"],
    //     },
    //     verified: {
    //       type: Boolean,
    //       required: true,
    //       default: false,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

const feeModel = mongoose.model("Student_Fees", feeSchema);

module.exports = feeModel;

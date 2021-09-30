const mongoose = require("mongoose");

const paymentLogSchema = new mongoose.Schema(
  {
    stud_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    stud_reg_num: { type: String },
    stud_section: { type: String },
    stud_branch: { type: String },
    stud_fullName: { type: String },
    stud_payment_list: [
      {
        stud_academic_year: {
          type: String,
        },
        stud_branch_year: {
          type: String,
        },
        feePaid: {
          type: Number,
        },
        date: {
          type: String,
          default: Date,
        },
        payment_mode: {
          type: String,
        },
        payment_details: mongoose.Schema.Types.Mixed,
        verified: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const paymentLogModel = mongoose.model("Payment", paymentLogSchema);

module.exports = paymentLogModel;

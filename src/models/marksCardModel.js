const mongoose = require("mongoose");

const marksCardSchema = mongoose.Schema(
  {
    stud_reg_num: { type: String },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    updated_by: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Faculty',
      // required: true
      type: String,
    },
    marksCard_list: [
      {
        semister: {
          type: String,
          // enum: [
          //   "sem-1",
          //   "sem-2",
          //   "sem-3",
          //   "sem-4",
          //   "sem-5",
          //   "sem-6",
          //   "sem-7",
          //   "sem-8",
          // ],
        },
        IA: [
          {
            IA_type: {
              type: String,
              // enum: ["IA-1", "IA-2"],
            },
            totalMarks: {
              type: Number,
            },
            result: {
              type: String,
              // enum: ["pass", "fail"],
            },
            remarks: {
              type: String,
            },
            marks: [
              {
                subject: {
                  type: String,
                },
                marks: {
                  type: Number,
                },
                isCompleted: {
                  type: String,
                  // enum: ["pass", "fail"],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const marksCardModel = mongoose.model("Markscard", marksCardSchema);

module.exports = marksCardModel;

// name:{},
// branch:{},
// academic_year: [
//   {
//     academic_year:"2022-23", //
//     semister: {
//       semister:"sem-1",
//       IA: {
//         IA_type: "1-IA",
//         marks : [{
//           subject: "CS",
//           marks: 123,
//           result: 'pass'
//         }]
//       }
//     }
//   },
//   {
//     academic_year:"2023-24", //
//     semister: {
//       semister:"sem-1",
//       IA: {
//         IA_type: "1-IA",
//         marks : [{
//           subject: "CS",
//           marks: 123,
//           result: 'pass'
//         }]
//       }
//     }
//   }
// ]

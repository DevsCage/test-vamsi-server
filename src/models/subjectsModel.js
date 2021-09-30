const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  branch: {
    type: String,
  },
  semister: [
    {
      semister_name: String,
      regulation: [
        {
          regulation_code: String,
          subjects: [
            {
              subject: String,
              sub_code: String,
            },
          ],
        },
      ],
    },
  ],
});

const subjectModel = mongoose.model("subjects_Api", subjectSchema);

module.exports = subjectModel;

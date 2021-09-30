const mongoose = require("mongoose");

const apiSchema = mongoose.Schema({
  stud_branch: [
    {
      type: String,
    },
  ],

  stud_academic_year: [
    {
      type: String,
    },
  ],

  stud_branch_year: [
    {
      type: String,
    },
  ],

  stud_semister: [
    {
      type: String,
    },
  ],

  stud_section: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("api_data", apiSchema);

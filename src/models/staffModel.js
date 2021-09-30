const moongose = require("mongoose");

const staffSchema = moongose.Schema({
  staff_fname: {
    type: String,
  },
  staff_lname: {
    type: String,
  },
  staff_mobno: {
    type: String,
  },
  staff_email: {
    type: String,
  },
  staff_dob: {
    type: String,
  },
  staff_type: {
    type: String,
  },
  staff_gender: {
    type: String,
  },
  staff_address: {
    type: String,
  },
  staff_city: {
    type: String,
  },
  staff_postcode: { type: String },
  staff_state: {
    type: String,
  },
});

const staffModel = moongose.model("Staff", staffSchema);
module.exports = staffModel;

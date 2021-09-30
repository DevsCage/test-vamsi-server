const Staff = require("../models/staffModel");

exports.createNewStaff = (req, res) => {
  console.log("data:", req.body);
  const {
    staff_fname,
    staff_lname,
    staff_mobno,
    staff_email,
    staff_dob,
    staff_type,
    staff_gender,
    staff_address,
    staff_city,
    staff_postcode,
    staff_state,
  } = req.body;

  const createNewStaff = new Staff({
    staff_fname,
    staff_lname,
    staff_mobno,
    staff_email,
    staff_dob,
    staff_type,
    staff_gender,
    staff_address,
    staff_city,
    staff_postcode,
    staff_state,
  });

  createNewStaff.save((error, _staff) => {
    if (error) {
      res.status(400).json({
        message: "Can't create the staff",
      });
    }
    if (_staff) {
      res.status(200).json({
        message: "Staff created",
      });
    }
  });
};

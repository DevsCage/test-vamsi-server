const Fee = require("../models/feeModel");
const PaymentLog = require("../models/paymentLogsModel.js");
const Student = require("../models/studentModel");
exports.addFee = async (req, res) => {
  const {
    stud_reg_num,
    stud_id,
    stud_fname,
    stud_lname,
    stud_branch,
    stud_academic_year,
    stud_branch_year,
    stud_section,
    stud_tution_fee,
    stud_addmission_fee,
    stud_lab_fee,
    stud_sports_fee,
    stud_transportation_fee,
    stud_other_fee,
    stud_hostel_fee,
    stud_total_fee,
    stud_paid_fee,
    stud_pending_fee,
    stud_other_fee_description,
    // stud_payment_list,
  } = req.body;
  console.log(req.body, "body");
  Fee.findOne({ stud_reg_num: stud_reg_num }).exec(function (err, data) {
    if (err) res.status(400).json({ message: "Student not found", err });
    if (data) {
      const findAcademicYear = data.stud_academic_year.find((el) => {
        return el.academic_year === stud_academic_year;
      });
      console.log("DAAT", findAcademicYear, "DATA");

      if (findAcademicYear) {
        res.status(400).json({
          message:
            "Fee for this Academic Year already exists, please try UPDATE",
        });
      }
      if (findAcademicYear == undefined) {
        Fee.findOneAndUpdate(
          {
            stud_reg_num: stud_reg_num,
          },
          {
            $push: {
              stud_academic_year: {
                academic_year: stud_academic_year,
                stud_branch_year: stud_branch_year,
                stud_tution_fee: stud_tution_fee,
                stud_addmission_fee: stud_addmission_fee,
                stud_sports_fee: stud_sports_fee,
                stud_lab_fee: stud_lab_fee,
                stud_transportation_fee: stud_transportation_fee,
                stud_other_fee: stud_other_fee,
                stud_paid_fee: stud_paid_fee,
                stud_pending_fee: stud_pending_fee,
                stud_hostel_fee: stud_hostel_fee,
                stud_total_fee: stud_total_fee,
                stud_other_fee_description: stud_other_fee_description,
              },
            },
          },
          {
            new: !0,
            upsert: !0,
          }
        ).exec((err, data) => {
          if (err) res.status(400).json({ message: "Update Error" });
          if (data) res.status(201).json({ data });
        });
      }
    } else {
      console.log("no data");
      const feeAdd = new Fee({
        stud_reg_num: stud_reg_num,
        stud_fname: stud_fname,
        stud_lname: stud_lname,
        stud_branch: stud_branch,
        stud_section: stud_section,
        stud_academic_year: {
          academic_year: stud_academic_year,
          stud_branch_year: stud_branch_year,
          stud_tution_fee: stud_tution_fee,
          stud_addmission_fee: stud_addmission_fee,
          stud_sports_fee: stud_sports_fee,
          stud_lab_fee: stud_lab_fee,
          stud_transportation_fee: stud_transportation_fee,
          stud_other_fee: stud_other_fee,
          stud_paid_fee: stud_paid_fee,
          stud_pending_fee: stud_pending_fee,
          stud_hostel_fee: stud_hostel_fee,
          stud_total_fee: stud_total_fee,
          stud_other_fee_description: stud_other_fee_description,
        },
        stud_id: stud_id,
      });

      feeAdd.save((error, studentfee) => {
        if (error) {
          res.status(400).json({
            message: "Data addition failed",
            error,
          });
        }
        if (studentfee) {
          res.status(201).json({
            message: "Data added",
            studentfee,
          });
        }
      });
    }
  });
};

//Updating

exports.feeUpdate = async (req, res) => {
  const reqs = req.body;
  console.log(req.body);
  Fee.findOne({ stud_id: reqs.stud_id }).exec((err, data) => {
    if (err) res.status(400).json({ message: "Student Not Found" });
    if (data) {
      const find_acadamic_year = data.stud_academic_year.find((el) => {
        return el.academic_year === reqs.academic_year;
      });

      if (find_acadamic_year !== undefined) {
        Fee.findOneAndUpdate(
          {
            stud_id: reqs.stud_id,
            "stud_academic_year.academic_year":
              find_acadamic_year.academic_year,
          },
          {
            $set: {
              "stud_academic_year.$": {
                academic_year: reqs.academic_year,
                stud_branch_year: reqs.stud_branch_year,
                stud_tution_fee: reqs.stud_tution_fee,
                stud_addmission_fee: reqs.stud_addmission_fee,
                stud_sports_fee: reqs.stud_sports_fee,
                stud_lab_fee: reqs.stud_lab_fee,
                stud_transportation_fee: reqs.stud_transportation_fee,
                stud_other_fee: reqs.stud_other_fee,
                stud_paid_fee: reqs.stud_paid_fee,
                stud_pending_fee: reqs.stud_pending_fee,
                stud_hostel_fee: reqs.stud_hostel_fee,
                stud_total_fee: reqs.stud_total_fee,
                stud_other_fee_description: reqs.stud_other_fee_description,
              },
            },
          },
          {
            new: !0,
          }
        ).exec((err, data) => {
          if (err) res.status(400).json({ message: "Update Error" });
          if (data) {
            const findChangedAcYear = data.stud_academic_year.filter((el) => {
              return reqs.academic_year === el.academic_year;
            });
            console.log(data, "DATTAAAAAAAAAAAAAAAAAAAAAA");
            console.log(
              findChangedAcYear,
              (stud_details = {
                stud_id: data.stud_id,
                stud_reg_num: data.stud_reg_num,
                stud_fname: data.stud_fname,
                stud_lname: data.stud_lname,
                stud_branch: data.stud_branch,
                stud_section: data.stud_section,
              })
            );
            res.status(200).json({
              findChangedAcYear,
              stud_details: {
                stud_current_fee: reqs.stud_current_fee,
                stud_id: data.stud_id,
                stud_reg_num: data.stud_reg_num,
                stud_fname: data.stud_fname,
                stud_lname: data.stud_lname,
                stud_branch: data.stud_branch,
                stud_section: data.stud_section,
              },
              message: "Added Fee Successfully!",
            });
          }
        });
      }
    }
  });
};

// Get fee by student ID

exports.getFeeByStudID = async (req, res) => {
  const stud_reg_num = req.body.USN;
  const stud_academic_year = req.body.stud_academic_year;
  const stud_branch_year = req.body.stud_branch_year;

  console.log(req.body, "dasvdasjgdasgjh");

  Fee.findOne({ stud_reg_num: stud_reg_num }).exec((err, data) => {
    if (data) {
      const filterData = data.stud_academic_year.find((el) => {
        return el.academic_year === stud_academic_year;
      });
      const student = {
        stud_reg_num: data.stud_reg_num,
        stud_fname: data.stud_fname,
        stud_lname: data.stud_lname,
        stud_id: data.stud_id,
        stud_branch: data.stud_branch,
        stud_section: data.stud_section,
      };

      if (filterData !== undefined) {
        res.status(201).json({
          filterData,
          student,
        });
      }
    } else {
      res.status(400).json({ message: "Student not Found" });
    }
  });
};

exports.findManyFeeByFilters = (req, res) => {
  console.log(req.body);
  const { stud_academic_year, stud_branch, stud_branch_year } =
    req.body.studentData;
  Fee.aggregate([
    {
      $match: {
        stud_branch: stud_branch,
      },
    },
    {
      $unwind: {
        path: "$stud_academic_year",
      },
    },
    {
      $match: {
        "stud_academic_year.academic_year": stud_academic_year,
        "stud_academic_year.stud_branch_year": stud_branch_year,
      },
    },
  ]).exec(function (err, data) {
    if (err) {
      res.status(400).json(err);
    }
    if (data) {
      res.status(200).json(data);
    }
  });
};

//get Fee by Student ID, this is for Student for Portal ONLY
exports.getFeeByStudIDForStudents = async (req, res) => {
  const student_id = req.body.student_id;
  const stud_academic_year = req.body.stud_academic_year;

  console.log(req.body, "dasdasdadasa");

  Fee.findOne({ stud_id: student_id }).exec((err, data) => {
    if (data) {
      const filterData = data.stud_academic_year.find((el) => {
        return el.academic_year === stud_academic_year;
      });
      const student = {
        stud_reg_num: data.stud_reg_num,
        stud_fname: data.stud_fname,
        stud_lname: data.stud_lname,
        stud_id: data.stud_id,
        stud_branch: data.stud_branch,
        stud_section: data.stud_section,
      };

      if (filterData !== undefined) {
        res.status(201).json({
          filterData,
          student,
        });
      } else {
        res.status(400).json({ message: "Fee not Found" });
      }
    } else {
      res.status(400).json({ message: "Student not Found" });
    }
  });
};

const Student = require("../models/StudentModel");
const userModel = require("../models/authStudentModel");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
exports.createStudent = (req, res) => {
  console.log("data: ", req.body);
  console.log("fiele", req.file);

  const document = {
    image: fs.readFileSync(
      path.join(path.dirname(__dirname) + "/uploads/" + req.file.filename)
    ),
    contentType: req.file.mimetype,
  };

  const {
    stud_fname,
    stud_lname,
    stud_reg_num,
    stud_email,
    stud_contact_no,
    stud_branch,
    stud_qouta,
    stud_cat,
    stud_ac_year,
    stud_branch_year,
    stud_religion,
    stud_caste,
    stud_subcaste,
    stud_class_div,
    stud_sem,
    stud_dob,
    stud_address,
    stud_city,
    stud_zip,
    stud_state,
    stud_gender,
    stud_adharno,
    stud_sys_init_password,
    stud_sys_username,
  } = req.body;
  const file = req.file;

  const newStudent = new Student({
    stud_fname,
    stud_lname,
    stud_reg_num,
    stud_email,
    stud_contact_no,
    stud_branch,
    stud_qouta,
    stud_cat,
    stud_academic_year: stud_ac_year,
    stud_branch_year,
    stud_religion,
    stud_caste,
    stud_subcaste,
    stud_section: stud_class_div,
    stud_semister: stud_sem,
    stud_dob,
    stud_address,
    stud_city,
    stud_zip,
    stud_state,
    stud_gender,
    stud_adharno,
    stud_sys_init_password,
    stud_sys_username,
    stud_photo: document,
    stud_fullName: `${stud_fname} ${stud_lname}`,
  });

  newStudent.save((error, student) => {
    if (error) {
      res.status(400).json({ message: error, msg: "Coudn't Create a Student" });
    }
    if (student) {
      res.status(200).json({
        data: {
          username: student.stud_email,
          password: student.stud_adharno,
          student_id: student._id,
          name: `${student.stud_fname} ${student.stud_lname}`,
          regNo: student.stud_reg_num,
          contactNumber: student.stud_contact_no,
        },
      });
    }
  });
};

exports.addStudentUser = (req, res) => {
  console.log(req.body, "adduser bpdy");
  userModel
    .find({ student_ref_id: req.body.student_id })
    .exec((error, user) => {
      if (error) {
        console.log(error);
        res.status(400).json({ message: "Error Finding Student User" });
      }
      if (user) {
        if (user.length > 0) {
          console.log(user, "USER");
          res.status(200).json({ message: "User Already Exist" });
        }

        if (user.length < 1) {
          console.log("NO USER");
          const user = new userModel({
            name: req.body.name,
            student_ref_id: req.body.student_id,
            userName: req.body.regNo,
            email: req.body.username,
            password: req.body.password,
            contactNumber: req.body.contactNo,
          });

          user.save((error, sys_user) => {
            if (error) {
              res
                .status(400)
                .json({ message: error, msg: "errrror creating student cred" });
            }
            if (sys_user) {
              res.status(200).json({ data: sys_user });
            }
          });
        }
      }
    });
};

exports.getAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.find();
    res.status(200).json(allStudents);
  } catch (error) {
    res.status(400).json({
      message: "Fetching from Database failed!",
    });
  }
};

exports.findStudentDelete = async (req, res) => {
  const id = req.params.id;
  try {
    Student.findByIdAndDelete(id).exec();
    res.status(200).json({
      message: "Successfully Deleted!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Cannot Deleted the Reqested Item!",
    });
  }
};

exports.getStudentByUSN = (req, res) => {
  const USN = req.body.USN;
  console.log(req.body);
  Student.findOne({ stud_reg_num: USN })
    // .select("stud_reg_num stud_fname stud_lname stud_contact_no stud_fullName stud_branch_year stud_academic_year stud_")
    .exec((err, student) => {
      if (student) res.status(200).json({ student });
      else res.status(400).json({ message: "Student not Found!" });
    });
};

exports.getStudentByID = (req, res) => {
  const ID = req.body.student_ref_id;
  console.log(ID);
  Student.findOne({ _id: ID })
    // .select("stud_reg_num stud_fname stud_lname")
    .exec((err, student) => {
      if (student) res.status(200).json({ student });
      else res.status(400).json({ message: "Student not Found!" });
    });
};

exports.getStudentDeatilsByID = (req, res) => {
  const ID = req.body.id;
  console.log(ID);
  Student.findOne({ _id: ID }).exec((err, student) => {
    if (student) res.status(200).json({ student });
    else res.status(400).json({ message: "Student not Found!" });
  });
};

// get students - filtered

exports.getStudents = async (req, res) => {
  const stud_ac_year = req.body.stud_ac_year;
  const stud_branch = req.body.stud_branch;
  const stud_sem = req.body.stud_sem;

  console.log(stud_ac_year, stud_branch, stud_sem);
  await Student.find({
    stud_academic_year: stud_ac_year,
    stud_branch: stud_branch,
    stud_semister: stud_sem,
  }).exec((error, students) => {
    if (students) {
      res.status(201).json({
        students,
      });
    }
    if (error) {
      res.status(404).json(error);
    }
  });
};

// update students - for admin

exports.updateStudents = async (req, res) => {
  const stud_reg_num = req.body.stud_reg_num;
  const stud_fname = req.body.stud_fname;
  await Student.findOneAndUpdate(
    { stud_reg_num: stud_reg_num },
    {
      $set: {
        stud_fname: stud_fname,
      },
    }
  ).exec((error, student) => {
    if (error) {
      res.status(400).json({
        message:
          "Error in fetching student, please check registration number" + error,
      });
    }
    if (student) {
      res
        .status(201)
        .json({ message: "Student Updated Successfully", student });
    }
  });
};

//reset passoword fwd otp

exports.ResetPasswordOTP = async (req, res) => {
  const { student_id, confirmPassword, password } = req.body;
  console.log(req.body);
  if (password === confirmPassword) {
    userModel.findOne({ student_ref_id: student_id }).exec((err, student) => {
      if (err) {
        res.status(201).json({ message: err.message });
      } else if (student) {
        userModel
          .findOneAndUpdate(
            {
              student_ref_id: student_id,
            },

            {
              $set: {
                hash_password: bcrypt.hashSync(password, 15),
              },
            }
          )
          .exec((err, resetSuccess) => {
            if (err) {
              res.status(201).json({
                err,
                message: "Password reset failed, please try again",
              });
            }
            if (resetSuccess) {
              res.status(201).json({ message: "Password reset successfully" });
            }
          });
      }
    });
  } else {
    res.status(400).json({ message: "Password mismatched" });
  }
};

exports.StudentBatchUpdate = async (req, res) => {
  const { studentBatchData, studentData } = req.body;
  console.log(req.body);

  const filterIds = studentData.map((student) => {
    return student._id;
  });

  Student.updateMany(
    { _id: { $in: filterIds } },
    {
      $set: {
        stud_academic_year: studentBatchData.ip1,
        stud_semister: studentBatchData.ip3,
        stud_branch_year: studentBatchData.ip2,
      },
    },
    function (err, data) {
      if (err) {
        res.status(400).json(err);
      }
      if (data) {
        res.status(201).json(data);
      }
    }
  );
};

// getStudentData from StudentID, this is for student portal && student profile

exports.getStudentsForStudentProfile = async (req, res) => {
  const student = req.body;

  console.log(student);
  await Student.find({
    _id: student && student.student_id,
  }).exec((error, students) => {
    if (students) {
      res.status(201).json({
        students,
      });
    }
    if (error) {
      res.status(404).json(error);
    }
  });
};

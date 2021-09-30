const jwt = require("jsonwebtoken");
const User = require("../models/authStudentModel");
const { sendTokenStudent } = require("../utils/jwtToken");
const bcrypt = require("bcrypt");

exports.studentSignin = (req, res) => {
  User.findOne({ userName: req.body.username }).exec((error, student) => {
    if (error) return res.status(400).json({ error });
    if (student) {
      if (student.authenticate(req.body.password)) {
        sendTokenStudent(student, 200, res);
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const currentPassword = req.body.currentPass;
  const newPassword = req.body.newPass1;
  const newPassword2 = req.body.newPass2;
  const stud_reg_num = req.body.student_reg_num;
  console.log(req.body);

  User.findOne({ userName: stud_reg_num }).exec((err, user) => {
    if (user) {
      console.log(user.hash_password);

      if (newPassword2 == newPassword) {
        console.log("object");
        bcrypt
          .compare(currentPassword, user.hash_password)
          .then((result) => {
            console.log(result, "TRUE");
            if (result) {
              User.findOneAndUpdate(
                { userName: stud_reg_num },
                {
                  $set: {
                    hash_password: bcrypt.hashSync(newPassword, 15),
                  },
                }
              ).exec((err, _user) => {
                if (_user) {
                  res.cookie("accessToken", null, {
                    expires: new Date(Date.now()),
                    httpOnly: true,
                  }),
                    res.cookie("auth", null, {
                      expires: new Date(Date.now()),
                    }),
                    res
                      .status(201)
                      .json({ message: "Updated Password Successfully!" });
                } else {
                  return res
                    .status(400)
                    .json({ message: "Error Updating Password!" });
                }
              });
            } else {
              return res.status(400).json({ message: "Password doesnt match" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("object-1");
        return res.status(400).json({ message: "New Passwords Don't Match" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Student not Found. Try Login Again!!" });
    }
  });
};

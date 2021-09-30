const jwt = require("jsonwebtoken");
const Faculty = require("../models/facultyModel");
const { sendTokenFaculty } = require("../utils/jwtToken");

exports.facultySignUp = (req, res) => {
  // Checking the User Wheather Exist or Not

  Faculty.findOne({ username: req.body.username }).exec((error, faculty) => {
    if (faculty)
      return res.status(400).json({
        message: "Username Already Exist",
      });

    const { username, password } = req.body;

    const _user = new Faculty({
      username: username,

      password: password,
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error,
          message: "Coudn't Create A New Acc",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "Faculty created Successfully...",
        });
      }
    });
  });
};

exports.facultySignin = (req, res) => {
  Faculty.findOne({ username: req.body.email }).exec((error, faculty) => {
    if (error) return res.status(400).json({ error });
    if (faculty) {
      if (faculty.authenticate(req.body.password)) {
        // const token = Admin.getJwtToken();
        // const { _id, username } = user;

        // res.status(200).json({
        //   token: `Bearer ${token}`,
        //   user: { _id, username },
        // });

        sendTokenFaculty(faculty, 200, res);
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

exports.AllLogout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  }),
    res.cookie("auth", null, {
      expires: new Date(Date.now()),
    }),
    res.redirect("http://localhost:3000/login");
};

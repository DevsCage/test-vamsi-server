const jwt = require("jsonwebtoken");
const User = require("../models/authStudentModel");
const Admin = require("../models/authAdminModel");
const { sendTokenAdmin } = require("../utils/jwtToken");

// exports.signup = (req, res) => {
//   // Checking the User Wheather Exist or Not
//   User.findOne({ email: req.body.email }).exec((error, user) => {
//     if (user)
//       return res.status(400).json({
//         message: "Email Already Exist",
//       });

//     const { firstName, lastName, email, password, contactNumber } = req.body;

//     const _user = new User({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: password,
//       role: "student",
//       contactNumber: contactNumber,
//     });

//     _user.save((error, data) => {
//       if (error) {
//         return res.status(400).json({
//           error,
//           message: "Coudn't Create A New User",
//         });
//       }

//       if (data) {
//         return res.status(201).json({
//           message: "User created Successfully...",
//         });
//       }
//     });
//   });
// };

// exports.signin = (req, res) => {
//   const { username, password } = req.body;

//   User.findOne({ userName: username }).exec((error, user) => {
//     if (error) return res.status(400).json({ error });
//     if (user) {
//       if (user.authenticate(password)) {
//         const token = jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
//           expiresIn: "1h",
//         });
//         const { _id, email, fullName, student_ref_id } = user;

//         res.status(200).json({
//           token: `Bearer ${token}`,
//           user: { _id, email, student_ref_id, fullName },
//         });
//       } else {
//         return res.status(400).json({
//           message: "Invalid Password",
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Something went wrong" });
//     }
//   });
// };

exports.requireSigninAsAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWTSECRET);
  req.user = user;

  if (req.user.role === "admin") {
    next();
  } else {
    res.status(400).json({ message: "Only Admin" });
  }
};

exports.requireSigninAsStudent = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWTSECRET);
  req.user = user;

  if (req.user.role === "student") {
    next();
  } else {
    res.status(400).json({ message: "Only Student" });
  }
};

exports.adminSignUp = (req, res) => {
  // Checking the User Wheather Exist or Not

  Admin.findOne({ username: req.body.username }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "Username Already Exist",
      });

    const { username, password } = req.body;

    const _user = new Admin({
      username: username,

      password: password,
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error,
          message: "Coudn't Create A New User",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "Admin created Successfully...",
        });
      }
    });
  });
};

exports.adminSignin = (req, res) => {
  Admin.findOne({ username: req.body.username }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      if (user.authenticate(req.body.password)) {
        // const token = Admin.getJwtToken();
        // const { _id, username } = user;

        // res.status(200).json({
        //   token: `Bearer ${token}`,
        //   user: { _id, username },
        // });

        sendTokenAdmin(user, 200, res);
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
    res.end(res.redirect(201, "http://localhost:3000/login"));
};

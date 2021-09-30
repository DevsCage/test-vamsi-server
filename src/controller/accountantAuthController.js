const jwt = require("jsonwebtoken");
const Accountant = require("../models/accountantModel");
const { sendTokenAccountant } = require("../utils/jwtToken");

exports.accountantSignUp = (req, res) => {
  // Checking the User Wheather Exist or Not

  Accountant.findOne({ username: req.body.username }).exec(
    (error, accountant) => {
      if (accountant)
        return res.status(400).json({
          message: "Username Already Exist",
        });

      const { username, password } = req.body;

      const _user = new Accountant({
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
            message: "Accountant created Successfully...",
          });
        }
      });
    }
  );
};

exports.accountantSignin = (req, res) => {
  console.log(req.body);
  Accountant.findOne({ username: req.body.email }).exec((error, accountant) => {
    if (error) return res.status(400).json({ error });
    if (accountant) {
      if (accountant.authenticate(req.body.password)) {
        // const token = Admin.getJwtToken();
        // const { _id, username } = user;

        // res.status(200).json({
        //   token: `Bearer ${token}`,
        //   user: { _id, username },
        // });

        sendTokenAccountant(accountant, 200, res);
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

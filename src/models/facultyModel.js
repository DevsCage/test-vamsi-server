const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userFacultySchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  hash_pass: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "faculty",
  },
});

userFacultySchema.virtual("password").set(function (password) {
  this.hash_pass = bcrypt.hashSync(password, 15);
});

userFacultySchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_pass);
  },
};

userFacultySchema.methods.getJwtTokenFaculty = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  );
};

module.exports = mongoose.model("user_faculty", userFacultySchema);

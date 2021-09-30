const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAdminSchema = mongoose.Schema({
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
    default: "admin",
  },
});

userAdminSchema.virtual("password").set(function (password) {
  this.hash_pass = bcrypt.hashSync(password, 15);
});

userAdminSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_pass);
  },
};

userAdminSchema.methods.getJwtTokenAdmin = function () {
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

module.exports = mongoose.model("users_admins", userAdminSchema);

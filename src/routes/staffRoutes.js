const express = require("express");
const path = require("path");
const router = express.Router();

const { createNewStaff } = require("../controller/staffController");

router.post("/newstaff", createNewStaff);

module.exports = router;

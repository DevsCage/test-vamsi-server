const express = require("express");
const router = express.Router();
const {
  getAPI,
  addAPI,
  addSubjects,
  getSubjects,
} = require("../controller/apiController");
// router.post("/addAPIs", addAPI);
router.get("/getAPI", getAPI);
router.post("/add-subjects", addSubjects);
router.post("/get-subjects", getSubjects);
module.exports = router;

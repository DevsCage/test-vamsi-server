const express = require("express");

const {
  addFee,
  feeUpdate,
  getFeeByStudID,
  findManyFeeByFilters,
  getFeeByStudIDForStudents,
} = require("../controller/feeController");
const { authorizeRoles, isAuthenticatedAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/add-fee", isAuthenticatedAdmin, authorizeRoles("admin"), addFee);
router.post("/update-fee", feeUpdate);
router.post("/fee-by-id", getFeeByStudID);
router.post("/fee-many-by-filters", findManyFeeByFilters);
router.post("/get-fee-by-id-for-students", getFeeByStudIDForStudents);

module.exports = router;

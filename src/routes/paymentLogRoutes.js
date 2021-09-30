const express = require("express");
const {
  addPaymentLog,
  getUVPaymentLog,
  getVPaymentLog,
  acceptPaymentLog,
  getPaymentLogsForStudent,
  getPaymentLogsForAdmin,
} = require("../controller/paymentLogController");

const router = express.Router();

router.post("/add-payment-log", addPaymentLog);
router.get("/get-uv-payment-log", getUVPaymentLog);
router.get("/get-v-payment-log", getVPaymentLog);
router.post("/accept-payment-log", acceptPaymentLog);
router.post("/get-payment-log-history", getPaymentLogsForStudent);
router.post("/get-payment-log-admin", getPaymentLogsForAdmin);

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const StudentRouter = require("./src/routes/studentRoutes");
const AuthRouter = require("./src/routes/authRoute");
const MiscRouter = require("./src/routes/miscRoutes");
const MarksCardRouter = require("./src/routes/marksCardRoute");
const StaffRouter = require("./src/routes/staffRoutes");
const FeeRouter = require("./src/routes/feeRoutes");
const PaymentLogRouter = require("./src/routes/paymentLogRoutes");
const ExamRouter = require("./src/routes/examFeeRoutes");
const APIRouter = require("./src/routes/apiRoute");
const UniversityFeeRouter = require("./src/routes/universityFeeRoutes");
const DocsRouter = require("./src/routes/documentsUploadRoute");

const app = express();
app.use(cookieParser());

dotenv.config();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to server " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
    res.status(500).json({ message: "Server Error Please try after sometime" });
  });

mongoose.set("useFindAndModify", false);

app.use("/api", StudentRouter);
app.use("/api", ExamRouter);
app.use("/api", AuthRouter);
app.use("/api", MiscRouter);
app.use("/api", MarksCardRouter);
app.use("/api", StaffRouter);
app.use("/api", FeeRouter);
app.use("/api", PaymentLogRouter);
app.use("/api", APIRouter);
app.use("/api", UniversityFeeRouter);
app.use("/api", DocsRouter);

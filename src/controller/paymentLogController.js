const PaymentLog = require("../models/paymentLogsModel");
const Student = require("../models/studentModel");
const mongoose = require("mongoose");

// add payment log model
const addPaymentLog = (req, res) => {
  const reqs = req.body;
  console.log(req.body);
  PaymentLog.findOne({ stud_id: reqs.stud_id }).exec((error, paymentstud) => {
    if (error) {
      res.status(400).json({
        message: "Error in matching student id",
        error,
      });
    }

    if (paymentstud) {
      console.log("STUDENT ID MATCHED ");

      PaymentLog.findOneAndUpdate(
        { _id: paymentstud._id },
        {
          $push: {
            stud_payment_list: reqs.stud_payment_list,
          },
        }
      ).exec((error, studfinduppo) => {
        if (error) {
          res.status(400).json({
            message: "Error- in matching ID, Inner error",
            error,
          });
        }
        if (studfinduppo) {
          res.status(200).json({ message: "Updated bro" });
        }
      });
    } else {
      console.log("ELSE");
      console.log({
        stud_section: reqs.stud_section,
        stud_branch: reqs.stud_branch,
        stud_fullName: reqs.stud_fullName,
        stud_reg_num: reqs.stud_reg_num,
        stud_id: reqs.stud_id,
        stud_payment_list: reqs.stud_payment_list,
      });
      const newPaymentLog = new PaymentLog({
        stud_section: reqs.stud_section,
        stud_branch: reqs.stud_branch,
        stud_fullName: reqs.stud_fullName,
        stud_reg_num: reqs.stud_reg_num,
        stud_id: reqs.stud_id,
        stud_payment_list: reqs.stud_payment_list,
      });
      newPaymentLog.save((err, data) => {
        if (err)
          res.status(400).json({
            err,
            message: "Something wrong Try again",
          });
        if (data) res.status(201).json({ data });
      });
    }
  });
};

// Get payment log for unverified payment

const getUVPaymentLog = async (req, res) => {
  await PaymentLog.aggregate([
    // {
    //   $addFields: {
    //     stud_academic_year: {
    //       $filter: {
    //         input: "$stud_academic_year",
    //         cond: {
    //           $eq: ["$$this.verified", false],
    //         },
    //       },
    //     },
    //   },
    // },
    // {
    //   $unwind: "$stud_academic_year",
    // },

    { $unwind: { path: "$stud_payment_list" } },
    { $match: { "stud_payment_list.verified": false } },
  ]).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: "Error", err });
    }

    if (data) {
      if (data.length > 0) {
        Student.populate(data, { path: "stud_id" }, function (err, studData) {
          if (studData) {
            res.status(200).json(data);
          }
          if (err) {
            res.status(400).json({ message: "Error", err });
          }
        });
      } else {
        res.status(400).json({ message: "All Logs are verified", err });
      }
    }
  });
};

// Get payment log for verified payment

const getVPaymentLog = async (req, res) => {
  await PaymentLog.aggregate([
    {
      $addFields: {
        stud_payment_list: {
          $filter: {
            input: "$stud_payment_list",
            cond: {
              $eq: ["$$this.verified", true],
            },
          },
        },
      },
    },
    {
      $unwind: "$stud_payment_list",
    },
  ]).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: "Error", err });
    }

    if (data) {
      Student.populate(data, { path: "stud_id" }, function (err, studData) {
        if (studData) {
          res.status(200).json(data);
        }
        if (err) {
          res.status(400).json({ message: "Error", err });
        }
      });
    }
  });
};

// Accept payment

const acceptPaymentLog = async (req, res) => {
  console.log(req.body);
  PaymentLog.findOne({ _id: req.body.paymentLogDocID }).exec((err, data) => {
    if (err)
      return res.status(400).json({ err, message: "No Paymant Log Found" });
    if (data) {
      console.log(data, "DATA");
      const findPayment = data.stud_payment_list.find((payment) => {
        console.log(payment._id, req.body.paymentLogSubDocID);
        return payment._id == req.body.paymentLogSubDocID;
      });

      console.log(findPayment, "pay");
      if (findPayment) {
        console.log("FOUND ");
        PaymentLog.findOneAndUpdate(
          {
            _id: req.body.paymentLogDocID,
            "stud_payment_list._id": req.body.paymentLogSubDocID,
          },
          {
            $set: {
              "stud_payment_list.$": {
                verified: true,
                stud_academic_year: findPayment.stud_academic_year,
                feePaid: findPayment.feePaid,
                payment_mode: findPayment.payment_mode,
                payment_details: findPayment.payment_details,
                date: findPayment.date,
              },
            },
          },
          { new: true }
        ).exec((err, data) => {
          console.log("EXEC");
          if (err) res.status(400).json({ err });
          else res.status(201).json({ data });
        });
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    }
  });
};

// Add the payment log
// const addPaymentLog = (req, res) => {
//   const { stud_reg_num, stud_id, stud_payment_list } = req.body;
//   console.log(req.body);
//   const newPaymentLog = new PaymentLog({
//     stud_reg_num: stud_reg_num,
//     stud_id: stud_id,
//     stud_payment_list: stud_payment_list,
//   });

//   Student.findOne({ stud_reg_num: stud_reg_num }).exec((error, student) => {
//     if (error) {
//       res.status(400).json({
//         message: "Error in finding student, check registration number",
//         error,
//       });
//     }
//     if (student) {
//       PaymentLog.findOne({ stud_id: student._id }).exec(
//         (error, paymentstud) => {
//           if (error) {
//             res
//               .status(400)
//               .json({ message: "Error in matching student id", error });
//           }

//           if (paymentstud) {
//             console.log("STUDENT ID MATCHED ");

//             PaymentLog.findOneAndUpdate(
//               { _id: paymentstud._id },

//               {
//                 $push: {
//                   stud_payment_list: stud_payment_list,
//                 },
//               }
//             ).exec((error, studfinduppo) => {
//               if (error) {
//                 res.status(400).json({
//                   message: "Error- in matching ID, Inner error",
//                   error,
//                 });
//               }
//               if (studfinduppo) {
//                 res.status(200).json({ message: "Updated bro" });
//               }
//             });
//           } else {
//             newPaymentLog.save((err, data) => {
//               if (err)
//                 res
//                   .status(400)
//                   .json({ err, message: "Something wrong Try again" });
//               if (data) res.status(201).json({ data });
//             });
//           }
//         }
//       );
//     }
//   });
// };

getPaymentLogsForStudent = (req, res) => {
  // aggregate([
  //   {
  //     $match: {
  //       stud_id: mongoose.Types.ObjectId(req.body.stud_id),
  //     },
  //   },
  // ])
  console.log(req.body);
  const stud_id = req.body.stud_id;
  PaymentLog.find({ stud_id: stud_id }).exec((err, data) => {
    if (err)
      return res.status(400).json({ err, message: "Something went wrong!" });
    if (data) {
      if (data.length > 0) {
        return res.status(201).json(data);
      } else {
        return res.status(400).json({ message: "No Results!" });
      }
    }
  });
};

getPaymentLogsForAdmin = (req, res) => {
  PaymentLog.aggregate([
    {
      $match: {
        stud_reg_num: req.body.stud_reg_num,
      },
    },
    {
      $unwind: {
        path: "$stud_payment_list",
      },
    },
    {
      $match: {
        "stud_payment_list.stud_academic_year": req.body.academic_year,
      },
    },
  ]).exec((err, data) => {
    if (err)
      return res.status(400).json({ err, message: "Something went wrong!" });
    if (data) return res.status(201).json(data);
  });
};

module.exports = {
  addPaymentLog,
  getUVPaymentLog,
  getVPaymentLog,
  acceptPaymentLog,
  getPaymentLogsForStudent,
  getPaymentLogsForAdmin,
};

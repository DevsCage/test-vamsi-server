const ExamFeeModel = require("../models/examFeeModel");
const mongoose = require("mongoose");

exports.addExamFee = async (req, res) => {
  const data = req.body.studentsData; // REACT
  const receivedSem = req.body.studentsData[0].stud_semister;
  console.log(data, "This is Exam Fee Data sent from redux");
  console.log(receivedSem, "receivedSem1");
  // const data = req.body; // POSTMAN
  // const receivedSem = req.body[0].stud_semister; // POSTMAN

  const filterIds = data.map((student) => {
    return student.stud_id;
  });

  await ExamFeeModel.find()
    .where("stud_id")
    .in(filterIds)
    .exec((err, _students) => {
      if (err) return res.status(400).json(err);
      if (_students) {
        if (_students.length < 1) {
          console.log("No student present, add new document");
          // res.send("No student");
          ExamFeeModel.insertMany(data, (err, data_res) => {
            if (err) {
              return res.status(400).json(err);
            }
            if (data_res) {
              res.status(200).json(data_res);
            }
          });
        } else {
          const filterSem = _students.filter((student) => {
            return student.stud_semister == receivedSem; // sem-1
          });

          console.log(filterSem, "FILTERED SEM IF");

          const onlySemisters =
            filterSem &&
            filterSem.map((student) => {
              return student.stud_semister;
            });

          ExamFeeModel.find()
            .where("stud_semister")
            .in(onlySemisters)
            .exec((err, finalFilterdStudents) => {
              if (err) return res.status(400).json(err);
              if (finalFilterdStudents.length < 1) {
                console.log("No Semester prest");
                ExamFeeModel.insertMany(data, (err, data) => {
                  if (err) {
                    return res.status(400).json(err);
                  } else {
                    return res.status(200).json(data);
                  }
                });
              } else {
                res.status(200).json({
                  finalFilterdStudents,
                  message: "Already FEES EXIST ",
                });
              }
            });
        }
      }
    });
};

//1309
exports.updateExistingExamFeeMany = (req, res) => {
  const reqs = req.body.mergedData;
  const paymentStatus = req.body.mergedData[0].payment_Status;
  // console.log(reqs, paymentStatus, "requss");
  const arrayData = reqs.map((data) => {
    const container = data.exam_fee_doc_id;
    return container;
  });

  console.log(arrayData, "arrayData");
  ExamFeeModel.updateMany(
    {
      _id: {
        $in: arrayData,
      },
    },
    {
      $set: {
        paymentStatus: paymentStatus,
      },
    },
    { multi: true, new: true },
    function (err, updateRes) {
      if (err) return res.status(400).json(err);
      if (updateRes) return res.status(201).json(updateRes);
    }
  );
  // ExamFeeModel.aggregate([
  //   {
  //     $match: {
  //       academic_year: reqs.academic_year,
  //     },
  //   },
  //   {
  //     $match: {
  //       stud_branch: reqs.stud_branch,
  //     },
  //   },
  //   {
  //     $match: {
  //       stud_semister: reqs.stud_semister,
  //     },
  //   },
  //   {
  //     $match: {
  //       stud_section: reqs.stud_section,
  //     },
  //   },
  //   {
  //     $match: {
  //       stud_id: mongoose.Types.ObjectId(reqs.stud_id),
  //     },
  //   },
  // ]).exec((err, data) => {
  //   if (err) {
  //     res.status(400).json(err);
  //   }
  //   if (data) {
  //     const filterIds = data.map((student) => {
  //       return mongoose.Types.ObjectId(student._id);
  //     });
  //     console.log(filterIds, "filterIds");
  //     ExamFeeModel.updateMany(
  //       {
  //         _id: {
  //           $in: filterIds,
  //         },
  //       },
  //       {
  //         $set: {
  //           paymentStatus: reqs.payment_Status,
  //         },
  //       },
  //       { multi: true, new: true },
  //       function (err, updateRes) {
  //         if (err) return res.status(400).json(err);
  //         if (updateRes) return res.status(201).json(updateRes);
  //       }
  //     );
  //   }
  // });
};

exports.updateExamFeeOne = (req, res) => {
  const reqs = req.body;
  console.log(reqs);
  ExamFeeModel.aggregate([
    {
      $match: {
        // stud_id: mongoose.Types.ObjectId("61307f381ccb9348644c818d"),
        stud_id: mongoose.Types.ObjectId(reqs.studId),
      },
    },
    {
      $match: {
        academic_year: reqs.academicYear,
        // academic_year: "2021-2022",
      },
    },
    {
      $match: {
        // stud_branch: "CS-Computer Science and Engineering",
        stud_branch: reqs.studBranch,
      },
    },
    {
      $match: {
        stud_semister: reqs.studSemister,
        // stud_semister: "1-1",
      },
    },
    {
      $match: {
        stud_section: reqs.studSection,
        // stud_section: "A",
      },
    },
  ]).exec((err, data) => {
    if (err) {
      res.status(400).json(err);
    }
    if (data) {
      const filterIds = data.map((student) => {
        return mongoose.Types.ObjectId(student._id);
      });

      ExamFeeModel.updateMany(
        {
          _id: {
            $in: filterIds,
          },
        },
        {
          $set: {
            paymentStatus: reqs.paidStatus,
            stud_exam_fee: reqs.examFee,
            stud_exam_supplimentary_fee: reqs.suppFee,
          },
        },
        {
          multi: true,
        },
        function (err, data) {
          if (err) return res.status(400).json(err);
          if (data) return res.status(201).json(data);
        }
      );
    }
  });
};

exports.getStudentForExamFeeOneUpdate = async (req, res) => {
  const reqs = req.body;
  console.log(reqs);
  ExamFeeModel.aggregate([
    { $match: { stud_reg_num: reqs.data.stud_reg_num } },
    { $match: { stud_branch: reqs.data.stud_branch } },
    { $match: { stud_section: reqs.data.stud_section } },
    { $match: { academic_year: reqs.data.stud_ac_year } },
    { $match: { stud_semister: reqs.data.stud_sem } },
  ]).exec((error, students) => {
    if (error) {
      res.status(400).json({ message: error });
    }
    if (students) {
      if (students.length > 0) {
        res.status(200).json(students);
      } else {
        res.status(400).json({ message: "No students found" });
      }
    }
  });
};
``;

exports.getFeeForUpdateMany = async (req, res) => {
  const reqs = req.body;
  console.log(reqs);
  await ExamFeeModel.aggregate([
    {
      $match: { stud_branch: reqs.data.stud_branch },
    },
    {
      $match: { academic_year: reqs.data.stud_ac_year },
    },
    {
      $match: { stud_semister: reqs.data.stud_sem },
    },
    {
      $match: { stud_section: reqs.data.stud_section },
    },
  ]).exec((err, data) => {
    if (err) {
      res.status(400).json(err);
    }
    if (data) {
      res.send(data);
    }
  });
};

// exam fee log fetch for student portal
exports.getExamFeeforStudent = async (req, res) => {
  console.log(req.body);
  ExamFeeModel.aggregate([
    { $match: { stud_id: mongoose.Types.ObjectId(req.body.stud_id) } },
    { $match: { academic_year: req.body.academic_year } },
  ]).exec((err, result) => {
    if (err) return res.status(400).json(err);
    if (result && result.length < 1) {
      res.status(400).json({ message: "No Exam Fee found!" });
    } else {
      res.status(201).json(result);
    }
  });
};

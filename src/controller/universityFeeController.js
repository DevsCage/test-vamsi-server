const universityFeeModel = require("../models/universityFeeModel");
const mongoose = require("mongoose");
exports.addUniversityFee = async (req, res) => {
  const data = req.body.studentsData; // REACT
  console.log(data, "from redux");
  const receivedSem = req.body.studentsData[0].stud_semister; // REACT

  // const data = req.body; // POSTMAN
  // const receivedSem = req.body[0].stud_semister; // POSTMAN

  const filterIds = data.map((student) => {
    return student.stud_id;
  });

  await universityFeeModel
    .find()
    .where("stud_id")
    .in(filterIds)
    .exec((err, _students) => {
      if (err) return res.status(400).json(err);
      if (_students) {
        if (_students.length < 1) {
          console.log("No student present");
          // res.send("No student");
          universityFeeModel.insertMany(data, (err, data_res) => {
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

          //   console.log(filterSem, "FILTERED SEM IF");

          const onlySemisters =
            filterSem &&
            filterSem.map((student) => {
              return student.stud_semister;
            });

          universityFeeModel
            .find()
            .where("stud_semister")
            .in(onlySemisters)
            .exec((err, finalFilterdStudents) => {
              if (err) return res.status(400).json(err);
              if (finalFilterdStudents.length < 1) {
                console.log("No Semester prest");
                universityFeeModel.insertMany(data, (err, data) => {
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

exports.updateExistingExamFeeMany = (req, res) => {
  ExamFeeModel.updateMany(
    { "stud_academic_year.stud_semister": "sem-1" },
    {
      $set: {
        "stud_academic_year.$.stud_exam_fee": 10000000,
        "stud_academic_year.$.stud_exam_supplimentary_fee": 100000,
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
};

exports.updateExistingSuppFeeMany = (req, res) => {
  ExamFeeModel.updateMany(
    { "stud_academic_year.stud_semister": "sem-1" },
    {
      $set: {
        "stud_academic_year.$.stud_exam_supplimentary_fee": 100000,
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
};

exports.updateUniversityFeesOne = async (req, res) => {
  const reqs = req.body;
  console.log(reqs, "body university fee");
  await universityFeeModel
    .aggregate([
      {
        $match: {
          stud_branch: reqs.studBranch,
        },
      },
      {
        $match: {
          academic_year: reqs.academicYear,
        },
      },
      {
        $match: {
          stud_semister: reqs.studSemister,
        },
      },
      {
        $match: {
          stud_section: reqs.studSection,
        },
      },
      {
        $match: { stud_reg_num: reqs.regNo },
      },
    ])
    .exec((error, universityFee) => {
      if (error) {
        res
          .status(400)
          .json({ message: "Error in getting University Data", error });
      }

      if (universityFee) {
        const filterIDs = universityFee.map((students) => {
          return mongoose.Types.ObjectId(students._id);
        });

        universityFeeModel.updateMany(
          {
            _id: { $in: filterIDs },
          },
          {
            $set: {
              paymentStatus: reqs.paidStatus,
              stud_university_fee: reqs.univerFee,
              stud_university_other_fee: reqs.univerMiscFee,
            },
          },
          { multi: true, new: true },
          function (error, updateRes) {
            if (error) return res.status(400).json(error);
            if (updateRes) return res.status(201).json(updateRes);
          }
        );
      }
    });
};

exports.getStudentForUniversityFeeOneUpdate = async (req, res) => {
  const reqs = req.body;
  console.log(reqs);
  universityFeeModel
    .aggregate([
      { $match: { stud_reg_num: reqs.data.stud_reg_num } },
      { $match: { stud_branch: reqs.data.stud_branch } },
      { $match: { stud_section: reqs.data.stud_section } },
      { $match: { academic_year: reqs.data.stud_ac_year } },
      { $match: { stud_semister: reqs.data.stud_sem } },
    ])
    .exec((error, students) => {
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

exports.getUniversityFeeForUpdateMany = async (req, res) => {
  const reqs = req.body;
  console.log(reqs);
  await universityFeeModel
    .aggregate([
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
    ])
    .exec((err, data) => {
      if (err) {
        res.status(400).json(err);
      }
      if (data) {
        res.send(data);
      }
    });
};

exports.updateExistingUniversityFeeMany = (req, res) => {
  const reqs = req.body.mergedData;
  const paymentStatus = req.body.mergedData[0].payment_Status;
  // console.log(reqs, paymentStatus, "requss");
  const arrayData = reqs.map((data) => {
    const container = data.university_fee_doc_id;
    return container;
  });

  console.log(arrayData, "arrayData");
  universityFeeModel.updateMany(
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
};

// university fee log fetch for student portal
exports.getUniversityFeeforStudent = async (req, res) => {
  console.log(req.body, "University");
  universityFeeModel
    .aggregate([
      { $match: { stud_id: mongoose.Types.ObjectId(req.body.stud_id) } },
      { $match: { academic_year: req.body.academic_year } },
    ])
    .exec((err, result) => {
      if (err)
        return res.status(400).json({ err, message: "Something went wrong!" });
      if (result && result.length < 1) {
        res.status(400).json({ message: "No University Fee found!" });
      } else {
        res.status(201).json(result);
      }
    });
};

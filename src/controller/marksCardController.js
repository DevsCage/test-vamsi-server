const mongoose = require("mongoose");
const MarksCardList = require("../models/marksCardModel");

const addMarksCard = (req, res) => {
  const { student_id, updated_by, marksCard_list, stud_reg_num } = req.body;
  console.log(req.body, "BODY");
  MarksCardList.findOne({
    student_id: student_id,
  }).exec((err, student) => {
    if (err)
      res.status(400).json({
        err,
        message: "Not Found",
      });
    if (student) {
      console.log(student, "STUDENT");
      const findSemister = student.marksCard_list.find((el) => {
        return el.semister === marksCard_list.semister;
      });

      const findIA =
        findSemister !== undefined
          ? findSemister.IA.find((el) => {
              return el.IA_type === marksCard_list.IA.IA_type;
            })
          : null;

      console.log(marksCard_list.IA, "fsadsdf");
      console.log(findIA, "findIA");
      console.log(findSemister, "findSemister");
      if (findSemister === undefined) {
        MarksCardList.findOneAndUpdate(
          {
            student_id: student_id,
          },
          {
            $push: {
              marksCard_list: marksCard_list,
            },
          },
          {
            new: !0,
            upsert: !0,
          }
        ).exec((err, data) => {
          if (err)
            res.status(400).json({
              message: err.message,
            });
          if (data)
            res.status(201).json({
              data,
            });
        });
      } else {
        if (findIA === undefined) {
          MarksCardList.findOneAndUpdate(
            {
              student_id: student_id,
              "marksCard_list.semister": findSemister.semister,
            },
            {
              $push: {
                "marksCard_list.$.IA": marksCard_list.IA,
              },
            },
            {
              new: true,
              upsert: !0,
            }
          ).exec((err, data) => {
            if (err) res.status(400).json(err);
            if (data) res.status(201).json(data);
          });
        } else {
          if (findIA && findSemister) {
            res.status(400).json({
              message: `Semister - ${findSemister.semister}, IA - ${findIA.IA_type} present in this MarksCard. Try Updating in Update Section`,
            });
          }
        }
      }
    } else {
      console.log("ESLE");
      const newMarksCard = new MarksCardList({
        student_id,
        updated_by,
        marksCard_list,
        stud_reg_num,
      });

      newMarksCard.save((err, marksCard) => {
        if (err) res.json(err);
        if (marksCard) res.json(marksCard);
      });
    }
  });
};

getSemMarksCardFaculty = async (req, res) => {
  const { semister, student_id, IA_type } = req.body;
  console.log(semister, student_id, IA_type);
  MarksCardList.aggregate([
    { $match: { stud_reg_num: student_id } },
    { $unwind: { path: "$marksCard_list" } },
    { $match: { "marksCard_list.semister": semister } },
    { $unwind: { path: "$marksCard_list.IA" } },
    { $match: { "marksCard_list.IA.IA_type": IA_type } },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "_id",
        as: "student",
      },
    },
  ]).exec((error, studentCard) => {
    if (error) res.status(400).json({ message: error });
    if (studentCard) {
      if (studentCard.length < 1) {
        res.status(400).json({
          message: `No Marks Card Found for semister - ${semister}, register number - ${student_id}, IA - ${IA_type}`,
        });
      } else {
        console.log(studentCard);
        res.status(201).json(studentCard);
      }
    }
  });
};

getMarksCardForStudents = async (req, res) => {
  const semister = req.body.semister;
  const student_id = req.body.student_id;
  const IA_type = req.body.IA_type;
  MarksCardList.aggregate([
    { $match: { stud_reg_num: student_id } },
    { $unwind: { path: "$marksCard_list" } },
    { $match: { "marksCard_list.semister": semister } },
    { $unwind: { path: "$marksCard_list.IA" } },
    { $match: { "marksCard_list.IA.IA_type": IA_type } },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "_id",
        as: "student",
      },
    },
  ]).exec((error, studentCard) => {
    if (error) res.status(400).json({ message: error });
    if (studentCard) {
      if (studentCard.length < 1) {
        res.status(400).json({
          message: `No Marks Card Found for semister - ${semister}, register number - ${student_id}, IA - ${IA_type}`,
        });
      } else {
        console.log(studentCard);
        res.status(201).json(studentCard);
      }
    }
  });
};

const updateMarkCard = (req, res) => {
  const { student_id, reg, sem, remarks, totalMarks, result, IA_Type, marks } =
    req.body;
  console.log(
    "BODY",
    student_id,
    reg,
    sem,
    remarks,
    totalMarks,
    result,
    IA_Type,
    marks,
    "BODY"
  );
  MarksCardList.find({ student_id: student_id }).exec((err, data) => {
    if (err) res.status(400).json({ message: "Something went wrong!" });
    if (data) {
      console.log(data);

      if (data.length < 1) {
        return res.status(400).json({ message: "Student not Found!" });
      } else {
        const findSem = data[0].marksCard_list.find((el) => {
          return el.semister === sem;
        });
        const findIA =
          findSem &&
          findSem.IA.find((el) => {
            return el.IA_type === IA_Type;
          });
        console.log(findSem, "FEINDASasaskndasdjnaskj");
        console.log(findIA, "IAAIAIAIAIIAIAIAIAIIAIIAIAI");

        if (findIA !== undefined && findSem !== undefined) {
          console.log("DEFINED");

          const removeOldIA = findSem.IA.filter((el) => {
            return el.IA_type !== IA_Type;
          });

          console.log("removed", removeOldIA, "removed");

          removeOldIA.push({
            IA_type: IA_Type,
            marks: marks,
            remarks: remarks,
            totalMarks: totalMarks,
            result: result,
          });

          MarksCardList.findOneAndUpdate(
            {
              student_id: student_id,
              "marksCard_list._id": mongoose.Types.ObjectId(findSem._id),
            },
            {
              $set: {
                "marksCard_list.$.IA": removeOldIA,
              },
            }
          ).exec((er, data) => {
            if (er)
              res.status(400).json({
                ...er,
                message: "Couldn't Update the MarksCard! Try Again",
              });
            if (data)
              res.status(201).json({ data, message: "Updated MarksCard!" });
          });
        } else {
          console.log("NO DEFINED");
          res.status(400).json({
            message:
              "Couldn't Update the MarksCard! Something wrong with IA type or SEM Try Again",
          });
        }
      }
    }
  });
};

// updateMarkCard = (req, res) => {
//   console.log(req.body);
//   const { student_id, sem, IA_Type, marks } = req.body;

//   MarksCardList.find({ student_id: student_id }).exec((err, data) => {
//     if (err) res.status(400).json({ message: "Student Not Found" });
//     if (data) {
//       console.log(data);

//       const findSem = data[0].marksCard_list.find((el) => {
//         return el.semister === sem;
//       });

//       const findIA = findSem && findSem.IA.find((el) => {
//         return el.IA_type === IA_Type;
//       });

//       const removeOldIA = findSem.IA.filter((el) => {
//         return el.IA_type !== IA_Type;
//       });

//       console.log("removed", removeOldIA, "removed");

//       removeOldIA.push({
//         IA_type: IA_Type,
//         marks: marks,
//       });

//       console.log("added", removeOldIA, "added");
//       MarksCardList.findOneAndUpdate(
//         {
//           student_id: student_id,
//           "marksCard_list._id": mongoose.Types.ObjectId(findSem._id),
//         },
//         {
//           $set: {
//             "marksCard_list.$.IA": removeOldIA,
//           },
//         },
//         { new: true }
//       ).exec((er, data) => {
//         if (er)
//           res.status(400).json({
//             ...er,
//             message: "Couldn't Update the MarksCard! Try Again",
//           });
//         if (data) res.status(400).json({ data, message: "Updated MarksCard!" });
//       });
//     }
//   });
// };

module.exports = {
  addMarksCard: addMarksCard,
  getMarksCardForStudents: getMarksCardForStudents,
  getSemMarksCardFaculty: getSemMarksCardFaculty,
  updateMarkCard: updateMarkCard,
};

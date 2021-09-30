const API = require("../models/apiModel");
const feeModel = require("../models/feeModel");
const subjectModel = require("../models/subjectsModel");
const Subject = require("../models/subjectsModel");

exports.getAPI = (req, res, next) => {
  console.log("incomeing reqyest");
  API.find().exec((err, data) => {
    if (err) {
      res.status(404).json({ message: "Error in fetching API data", error });
    }

    if (data) {
      res.status(200).json({ data });
    }
  });
};

exports.addSubjects = async (req, res) => {
  console.log(req.body, "req");
  const reqs = req.body;

  Subject.findOne({ branch: reqs.branch }).exec((err, branch) => {
    if (err) {
      res.status(400).json({ message: "Error", err });
    }
    if (branch) {
      console.log("NRANCG", branch);
      const findSemister = branch.semister.find((sem) => {
        return sem.semister_name == reqs.semister.semister_name; // SEM NM
      });

      console.log(findSemister, "semsem");
      if (findSemister !== undefined) {
        //regulation code for
        const findRegulationCode = findSemister.regulation.find(
          (regulation) => {
            return (
              regulation.regulation_code ==
              reqs.semister.regulation.regulation_code
            ); //reqs.regulation_code
          }
        );
        console.log(findRegulationCode, "codecode");

        if (findRegulationCode !== undefined) {
          const findSubject = findRegulationCode.subjects.find((subject) => {
            return (
              subject.sub_code == reqs.semister.regulation.subjects.sub_code
            );
          });

          // add mew subjects
          console.log("regulation is present");

          if (findSubject !== undefined) {
            console.log("subject is present");
            res.send("subject is present in db");
          } else {
            console.log("subject is not present");

            Subject.findOneAndUpdate(
              { branch: reqs.branch },
              {
                $push: {
                  "semister.$[semister].regulation.$[regulation].subjects":
                    reqs.semister.regulation.subjects,
                },
              },
              {
                new: true,
                arrayFilters: [
                  { "semister.semister_name": reqs.semister.semister_name },
                  {
                    "regulation.regulation_code":
                      reqs.semister.regulation.regulation_code,
                  },
                ],
              }
            ).exec((err, data) => {
              if (err) {
                res.status(400).json(err);
              }

              if (data) {
                res.status(201).json(data);
              }
            });
          }
        } else {
          console.log("REG IS NOT PRESENT");

          Subject.findOneAndUpdate(
            {
              branch: reqs.branch,
              "semister.semister_name": reqs.semister.semister_name,
            },
            {
              $push: {
                "semister.$.regulation": reqs.semister.regulation,
              },
            },
            { new: true }
          ).exec((err, data) => {
            if (err) {
              res.status(400).json(err);
            }

            if (data) {
              res.status(201).json(data);
            }
          });
        }
      } else {
        // add new sem
        console.log("ADD NEW SEM");

        Subject.findOneAndUpdate(
          { branch: reqs.branch },
          {
            $push: {
              semister: reqs.semister,
            },
          },
          { new: true }
        ).exec((err, data) => {
          if (err) {
            res.status(400).json(err);
          }

          if (data) {
            res.status(201).json(data);
          }
        });
      }
    } else {
      // create new doc
      console.log("else", branch);

      const reg = new Subject({
        branch: reqs.branch,
        semister: reqs.semister,
      });

      reg.save(function (err, branch) {
        if (err) {
          res.status(400).json(err);
        }
        if (branch) {
          res.status(200).json(branch);
        }
      });
    }
  });
};

exports.getSubjects = async (req, res) => {
  console.log(req.body, "body");
  const { apiSubbranch, apiSubregCode, apisubsem } = req.body;
  Subject.aggregate([
    { $match: { branch: apiSubbranch } },
    {
      $unwind: {
        path: "$semister",
      },
    },
    { $match: { "semister.semister_name": apisubsem } },
    {
      $unwind: {
        path: "$semister.regulation",
      },
    },

    {
      $match: {
        "semister.regulation.regulation_code": apiSubregCode,
      },
    },
    // {
    //   $unwind: {
    //     path: "$semister.regulation.subjects",
    //   },
    // },
  ]).exec((err, data) => {
    if (err) {
      res.status(400).json(err);
    }
    if (data) {
      res.status(200).json(data);
    }
  });
};

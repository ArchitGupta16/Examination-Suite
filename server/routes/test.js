const router = require("express").Router();
const test = require("../models/test.model");
const result = require("../models/result.model");
const question = require("../models/question.model");
const axios = require("axios");
const verify = require("./verifyToken");
const student = require("../models/student.model");

router.route("/").post(async (req, res) => {
  const testid = req.body.pin;
  const aadhaar = req.body.aadhaar;
  const doc = await test.findOne({ pin: testid }).exec();
  if (!doc) {
    return res.status(400).send({ message: "Test doesn't exist!" });
  }
  if (Date.parse(doc.expiry) < Date.now()) {
    return res.status(400).send({ message: "Test has expired!! " });
  }
  const check = await result.findOne({ pin: testid, aadhaar }).exec();
  if (check) {
    return res.status(400).send({message:"Test already taken!"});
  }
  let ques = {
    response_code: 0,
  };
  ques.results = await question.find({ category: doc.topic }).exec();
  if (ques.results.length > 0) {
    ques.response_code = 1;
  } else {
    console.log("failed");
  }
  ques.time = doc.time;
  ques.category = doc.topic;
  if (ques.response_code == 1) return res.send(ques);
  else
    return res
      .status(400)
      .send({ message: "Couldn't fetch test details. Try again!" });
});

router.route("/submittest").post(async (req, res) => {
  const score = parseInt(req.body.score);
  const aadhaar = req.body.aadhaar;
  const name = req.body.name;
  const pin = req.body.pin;
  const resu = req.body.answers;
  const indi = req.body.loc;
  const resultEntry = new result({ aadhaar, name, pin, score, result:resu, individualScore:indi });
  resultEntry
    .save()
    .then(() => res.send("result added!"))
    .catch((err) => res.status(400).json("Could not add to database: " + err));
});

router.use("/gettests", verify);
router.use("/getresults", verify);
router.use("/addtest", verify);

router.route("/gettests").post(async (req, res) => {
  const aadhaar = req.user.aadhaar;
  try {
    const doc = await test.find({ aadhaar }).sort("-created").exec();
    return res.send(doc);
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
});

router.route("/getresults").post(async (req, res) => {
  const pin = req.body.pin;
  try {
    const resultdoc = await result.find({ pin }).exec();
    return res.send(resultdoc);
  } catch (err) {
    return res.status(400).send();
  }
});

router.route("/addtest").post(async (req, res) => {
  const pin = (await test.countDocuments({}).exec()) + 1000;
  const aadhaar = req.user.aadhaar;
  const amount = req.body.amount;
  const topic = req.body.topic;
  const time = req.body.time;
  const expiry = Date.parse(req.body.expiry);
  const created = Date.parse(req.body.created);

  const newtest = new test({
    pin,
    aadhaar,
    amount,
    topic,
    time,
    expiry,
    created,
  });
  newtest
    .save()
    .then(() => res.send("test added!"))
    .catch((err) => res.status(400).json("error : " + err));
});

router.route("/getquestions").post(async (req, res) => {
  const pin = req.body.pin;
  const doc = await test.findOne({ pin: pin }).exec();
  const ques = await question.find({ category: doc.topic }).exec();
  let response_code = 0;
  if (ques.length > 0) {
    response_code = 1;
  } else {
    console.log("failed");
  }

  if (response_code == 1) return res.send(ques);
  else
    return res
      .status(400)
      .send({ message: "Couldn't fetch test details. Try again!" });
});

router.route("/updateScore").put(async (req, res) => {
  const pin = req.body.pin;
  const aadhaar = req.body.aadhaar;
  const score = req.body.score;
  const indi = req.body.indi;
  result.findOneAndUpdate({pin:pin,aadhaar:aadhaar},{score:score,individualScore:indi})
  .then((result) => {
    res.send("Score updated");
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send("Error updating score");
  });
});

router.route("/studentProfile").post(async (req, res) => {
  console.log(req.body);
  const aadhaar = req.body.aadhaar;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const parentName = req.body.parentName;
  const gender = req.body.gender;
  const projectName = req.body.projectName;
  const state = req.body.state;
  const city = req.body.city;
  const profile = new student({ aadhaar, firstName, lastName, parentName, gender, projectName, state, city });
  profile
    .save()
    .then(() => {
    console.log("Student profile added!");
    res.send("Student profile added!")
    })
    .catch((err) => {console.log(err.message),res.status(400).json("Could not add to database: " + err)} );
});

module.exports = router;
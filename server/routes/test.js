const router = require("express").Router();
const test = require("../models/test.model");
const result = require("../models/result.model");
const question = require("../models/question.model");
const axios = require("axios");
const verify = require("./verifyToken");

router.route("/").post(async (req, res) => {
  const testid = req.body.pin;
  const email = req.body.email.toLowerCase();
  const doc = await test.findOne({ pin: testid }).exec();
  if (!doc) {
    return res.status(400).send({ message: "Test doesn't exist!" });
  }
  if (Date.parse(doc.expiry) < Date.now()) {
    return res.status(400).send({ message: "Test has expired!! " });
  }
  const check = await result.findOne({ pin: testid, email }).exec();
  if (check) {
    return res.status(400).send({message:"Test already taken!"});
  }
  // console.log(doc.topic,"topic here")
  let ques = {
              response_code: 0,
            }

  ques.results = await question.find({ category: doc.topic }).exec()
  // console.log(ques.results)
  if (ques.results.length > 0) {
    ques.response_code = 1
  }
  else{
    console.log("failed")
  }
  ques.time = doc.time
  ques.category = doc.topic
  if (ques.response_code == 1) return res.send(ques);
  else
    return res
      .status(400)
      .send({ message: "Couldn't fetch test details. Try again!" });
});

router.route("/submittest").post(async (req, res) => {
  const score = parseInt(req.body.score);
  const email = req.body.email.toLowerCase();
  const name = req.body.name;
  const pin = req.body.pin;
  const resu = req.body.answers;
  const resultEntry = new result({ email, name, pin, score, result:resu });
  resultEntry
    .save()
    .then(() => res.send("result added!"))
    .catch((err) => res.status(400).json("Could not add to database: " + err));
});

router.use("/gettests", verify);
router.use("/getresults", verify);
router.use("/addtest", verify);

router.route("/gettests").post(async (req, res) => {
  const email = req.user.email;
  try {
    const doc = await test.find({ email }).sort("-created").exec();
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
  const email = req.user.email.toLowerCase();
  const amount = req.body.amount;
  const topic = req.body.topic;
  const time = req.body.time;
  const expiry = Date.parse(req.body.expiry);
  const created = Date.parse(req.body.created);

  const newtest = new test({
    pin,
    email,
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
  const ques = await question.find({ category: doc.topic }).exec()
  let response_code = 0
  if (ques.length > 0) {
    response_code = 1
  }
  else{
    console.log("failed")
  }

  if (response_code == 1) return res.send(ques);
  else
    return res
      .status(400)
      .send({ message: "Couldn't fetch test details. Try again!" });

});

module.exports = router;

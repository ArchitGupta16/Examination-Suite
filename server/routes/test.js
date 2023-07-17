const router = require("express").Router();
const test = require("../models/test.model");
const result = require("../models/result.model");
const question = require("../models/question.model");
const verify = require("./verifyToken");
const student = require("../models/student.model");

router.route("/").post(async (req, res) => {
  const testid = req.body.pin;
  const doc = await test.findOne({ pin: testid }).exec();

  if (!doc) {
    return res.status(400).send({ message: "Test doesn't exist!" });
  }

  if (Date.parse(doc.expiry) < Date.now()) {
    return res.status(400).send({ message: "Test has expired!! " });
  }

  let ques = {
    response_code: 0,
  };

  ques.results = await question.find({ category: doc.topic }).exec();
  if (ques.results.length > 0) 
    {
      ques.response_code = 1;
    } 
  else 
    {
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
  const testID = req.body.testID;
  const aadhaar = req.body.aadhaar;
  const firstName = req.body.firstName;
  const pin = req.body.pin;
  const resu = req.body.answers;
  const indi = req.body.loc;
  const resultEntry = new result({ aadhaar,testID, firstName, pin, score, result:resu, individualScore:indi });
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
  const testname = req.body.topic;
  const email = req.user.email.toLowerCase();
  const amount = req.body.amount;
  const topic = await test.countDocuments({}).exec() + 2;
  const time = req.body.time;
  const expiry = Date.parse(req.body.expiry);
  const created = Date.parse(req.body.created);

  const newtest = new test({
    testname,
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
  const ques = await question.find({ category: doc.topic }).exec();
  let response_code = 0;
  // console.log(doc);
  // console.log(ques.length);
  if (ques.length === 0) {
    return res.status(405).send({ message: "No questions found" });
  }
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
  const documentType = req.body.documentType;
  const aadhaar = req.body.aadhaar;
  const ration = req.body.ration;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const fatherName = req.body.fatherName;
  const motherName = req.body.motherName;
  const gender = req.body.gender;
  const projectName = req.body.projectName;
  const clas = req.body.studentClass;
  const state = req.body.state;
  const city = req.body.city;
  const dob = req.body.dob;
  const attempts = req.body.attempts;

  const dateOfBirth = new Date(dob);

  const testID = firstName.substring(0, 2) + lastName.substring(0, 2) + fatherName.substring(0, 2) + motherName.substring(0, 2) + gender.substring(0, 1) + clas;

  student.findOne({ testID: testID })
    .then(existingProfile => {
      if (existingProfile) 
      {
        existingProfile.attempts = (existingProfile.attempts || 1) + 1;
        existingProfile.save()
          .then(() => {
            console.log("Student profile updated!");
            res.send({ ID: testID, attempts: existingProfile.attempts });
          })
          .catch((err) => {
            console.log(err.message);
            res.status(400).json("Could not update the profile: " + err);
          });
      } 
      
      else 
      {
        const profile = new student({ firstName, lastName, ration, aadhaar, fatherName, motherName, gender, projectName, state, city, testID, clas, dateOfBirth , attempts});
        profile.save()
          .then(() => {
            console.log("Student profile added!");
            res.send({ ID: testID });
          })
          .catch((err) => {
            console.log(err.message);
            res.status(400).json("Could not add to the database: " + err);
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).json("Could not find student profile: " + err);
    });
});

router.route("/getStudentProfile").post(async (req, res) => {
  const testID = req.body.testID;
  try {
    const doc = await student.findOne({ testID }).exec();
    res.send(doc);
  } catch (err) { 
    return res.status(400).send();
  }
});

module.exports = router;
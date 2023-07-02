const router = require("express").Router();
const test = require("../models/test.model");
const result = require("../models/result.model");
const question = require("../models/question.model");
const axios = require("axios");
const verify = require("./verifyToken");


router.route("/deleteQuestion").delete(async (req, res) => {
    const questionId = req.body.id;
    console.log(questionId)
    const ques = await question.deleteOne({_id:questionId})
    console.log(ques);
    if (ques.deletedCount === 1) {
        return res.status(200).send({ message: "Question deleted!" });
    }
    else {
        return res.status(400).send({ message: "Question not found!" });
    }
     });

router.route("/updateQuestion").put(async (req, res) => {
    console.log(req.body)
    const questionId = req.body.modifiedQuestion._id;
    const updatedQuestion = req.body.modifiedQuestion;
    console.log(questionId)
    const upd = await question.updateOne({_id:questionId},updatedQuestion)
    if (upd.nModified === 1) {
        return res.status(200).send({ message: "Question updated!" });
    }   
    else {
        return res.status(400).send({ message: "Question not found!" });
    }
    });

router.route("/addQuestion").post(async (req, res) => {
    console.log(req.body.newQuestion)
    const quest = req.body.newQuestion;
    const ques = new question(quest);
    const savedQuestion = await ques.save();
    if (savedQuestion) {
        return res.status(200).send({ message: "Question added!" });
    }
    else {
        return res.status(400).send({ message: "Question not added!" });
    }
})    
  module.exports = router;
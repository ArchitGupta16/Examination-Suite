const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correct_answer: {
    type: Array,
    required: true,
  },
    incorrect_answers: {
    type: Array,
    required: false,
    },
  image :{
      type:String,
      required: false,
  }
});

const question = mongoose.model("question", questionSchema);

module.exports = question;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  pin: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  aadhaar: {
    type: String,
    required: false,
  },
  ration : {  
    type: String,
    required: false,  
  },
  score: {
    type: String,
    required: true,
  },
  result: {
    type: Object,
    required: false,
  },
  individualScore: {
    type: Object,
    required: false,
  },
  testID: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    required: true,
  },
});

const result = mongoose.model("result", resultSchema);

module.exports = result;
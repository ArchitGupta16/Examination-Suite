const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: false,
  },
  fatherName: {
    type: String,
    required: false
  },

  motherName: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  class: {
    type: Number,
    required: false
  },
  projectName: {
    type: String,
    required: false
  },

  state: {
    type: String,
    required: false
  },

  city: {
    type: String,
    required: false
 },
 testID :{
    type: String,
    required: true
 },

 aadhaar: {
  type: String, 
  required: false
 },

 ration: {
  type: String,
  required: false
  },

 dob: {
  type: Date,
  required: false
 }
});

module.exports = mongoose.model("Student", studentSchema);
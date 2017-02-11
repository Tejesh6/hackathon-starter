const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require ('./User');

const projectDetails = new mongoose.Schema({
  name: String,
  briefDescription: String,
  detailedDescription:{type: String},
  campaignStartDate:Date,
  campaignEndDate:Date,
  numberOfBackers:Number,
  minimunBackersRequired: Number,
  status: {type: String, enum: ["Started","WaitingForBackers"]},
  eventDetails:{
   startDate: Date
  },
  location:String,
  user: {type: mongoose.Schema.Types.ObjectId, ref : User},
  isPublished:Boolean,

}, { timestamps: true });

const project = mongoose.model('Project', projectDetails);

module.exports = project;

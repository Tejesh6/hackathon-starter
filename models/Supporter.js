const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require ('./User');

const supporterDetails = new mongoose.Schema({
    project:{type: mongoose.Schema.Types.ObjectId, ref : 'Project'},
    user: {type: mongoose.Schema.Types.ObjectId, ref : 'User'}
}, { timestamps: true });

const project = mongoose.model('Supporter', supporterDetails);

module.exports = project;

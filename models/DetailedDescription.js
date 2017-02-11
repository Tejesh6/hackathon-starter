
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const detailedDesc = new mongoose.Schema({
    cause: string,
    goal: string,
    venue: string,
    location: string,

});

module.exports = DetailedDescription;

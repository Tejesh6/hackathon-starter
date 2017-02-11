const nodemailer = require('nodemailer');
const Project = require('../models/Project');
const Supporter = require('../models/Supporter');
const _ = require("underscore");
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getProject = (req, res) => {
  res.render('createproject', {
    title: 'Create Project'
  });
};

/**
 * POST /project
 * create a new project form via Nodemailer.
 */
exports.postProject = (req, res) => {
  var project = new Project();
  _.extend(project,req.body);
  project.save( function (err, result) {
    console.log("Server received:",req.body);
    res.redirect("/project/"+result._id);
  });
};

exports.listProjects = (req, res) => {
  Project.find({}, function (err, result) {
    res.render('projectList',{projects:result } );
  });
};

exports.getDescription = (req, res) => {
  Project.findById(req.params.id, function (err, result) {
    console.log(result);
    res.render('projectDescription', {project:result });
  });
};

exports.postDescription = (req, res) => {
  console.log(req);
  var supporter = new Supporter();
  supporter.project = req.params.id;
  supporter.user = req.user;
  supporter.save(function (err, result) {
    if (!err)
      req.flash('success', { msg: 'You supported this project.' });
    res.redirect("/project/"+req.params.id);
  });
};



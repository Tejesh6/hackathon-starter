const async = require('async');
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
  _.extend(project, req.body);
  console.log('received: ', req.body)
  console.log('converted: ', project)
  project.save(function (err, result) {
    console.log("Server received:", req.body);
    res.redirect("/project/" + result._id);
  });
};

exports.listProjects = (req, res) => {
  Project.find({}, function (err, result) {
    res.render('projectList', {
      projects: result
    });
  });
};

exports.getDescription = (req, res) => {
  var project;
  var bakkers;
  var iSupported = false;

  async.parallel([
    (callback) => {
      Project.findById(req.params.id, function (err, result) {
        console.log('Project', result);
        project = result;
        callback();
      });
    },
    (callback) => {
      Supporter.find({
        project: req.params.id
      }).populate('user').exec(function (err, result) {
        console.log('Supporter', result);
        bakkers = result;
        iSupported = bakkers.filter(function (support) {
          return (support.user == req.user.id)
        }).length > 0;
        callback();
      });
    }
  ], function () {
    res.render('projectDescription', {
      project: project,
      supporters: bakkers,
      iSupported: iSupported
    });
  });
};

exports.postDescription = (req, res) => {
  console.log(req.body);
  var supporter = new Supporter();
  supporter.project = req.params.id;
  supporter.user = req.user;
  supporter.save(function (err, result) {
    if (!err)
      req.flash('success', {
        msg: 'You supported this project.'
      });
    res.redirect("/project/" + req.params.id);
  });
};
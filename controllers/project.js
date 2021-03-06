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
    title: 'Create Project',
    project: {}
  });
};

/**
 * POST /project
 * create a new project form via Nodemailer.
 */
exports.postProject = (req, res) => {
  var project = new Project();
  _.extend(project, req.body);
  project.user = req.user;
  project.numberOfBackers = 0;
  console.log('received: ', req.body)
  console.log('converted: ', project)
  project.save(function (err, result) {
    console.log("Server received:", req.body);
    res.redirect("/project/" + result._id);
  });
};

exports.listProjects = (req, res) => {
  Project.find({}).populate('user').exec(function (err, result) {
    console.log('All projects', result);
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
        console.log('   Req user:', req.user.id);
        iSupported = bakkers.filter(function (support) {
          console.log('   A supporter', support.user.id);
          return (support.user.id == req.user.id)
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
  Project.findById(req.params.id, function(err, p) {
    if (p)
      p.numberOfBackers = p.numberOfBackers +1;
      p.save(function(err) {
        if (err)
          console.log('error')
        else
          console.log('success')
      });
  });
};


exports.getEdit = (req, res) => {
  Project.findById(req.params.id, function (err, result) {
    res.render('createproject', {
      title: 'Edit Project',
      project: result
    });
  });
};

exports.postEdit = (req, res) => {
  Project.findById(req.params.id, function (err, result) {
    _.extend(result, req.body);
    console.log('received: ', req.body)
    console.log('converted: ', result)
    result.save(function (err, result2) {
      console.log("Server received:", req.body);
      res.redirect("/project/" + result._id);
    });
  });
};
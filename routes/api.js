/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var projectModel = require('../models/projectModel');
var ObjectId = require('mongodb').ObjectID;

module.exports = function (app,db) {

  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  app.route('/api/issues/:project')

    .get(function (req, res){
        var project = req.query;
        console.log(project)
        projectModel.find(project)
        .then((proj) => {
          res.send(proj)
        })
        .catch((error)=>{
          console.log(error)
        })
    })

    .post(function (req, res){
      if(!(req.body.issue_title && req.body.issue_text && req.body.created_by)){
          res.status(400).end();
      }
      else {
        var project = {
          issue_title : req.body.issue_title,
          issue_text : req.body.issue_text,
          created_by : req.body.created_by,
          open : true
        };
        if(req.body.assigned_to)
          project.assigned_to = req.body.assigned_to;
        if(req.body.status_text)
          project.status_text = req.body.status_text;

        projectModel.create(project)
        .then((data)=> {
          res.status(200).send(data);
        })
        .catch((error)=>{
          console.log(error);
          res.status(404).end();
        })
      }

    })

    .put(function (req, res){
      if(isEmpty(req.body)){
        res.status(400).send('no updated field sent');
      }
      else {
        console.log("req.body" + req.body.issue_title)
        var project = {};

        if(req.body.issue_title)
          project.issue_title = req.body.issue_title;
        if(req.body.issue_text)
          project.issue_text = req.body.issue_text;
        if(req.body.status_text)
          project.status_text = req.body.status_text;
        if(req.body.open)
          project.open = req.body.open;

        console.log(project)
        projectModel.findOneAndUpdate({ _id : req.body._id}, project,  {new: true})
        .then((data)=>{
          res.send(data);
          console.log("data " + data)
        })
        .catch((error)=>{
          console.log(error);
          res.status(400).end();
        })
      }
    })

    .delete(function (req, res){
      var projectId = req.params.project;
      //console.log(projectId)
      if(isEmpty(projectId)){
        res.status(400).send('_id error');
      }
      else {
        projectModel.findByIdAndDelete(projectId)
        .then((project)=>{
          console.log(project)
          res.send('deleted ' + projectId);
        })
        .catch((err)=>{
          res.status(400).send('could not delete ' + projectId);
        })
      }
    });
};

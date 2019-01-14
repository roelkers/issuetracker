var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  issue_title : String,
  issue_text : String,
  created_by : String,
  assigned_to : String,
  status_text : String,
  open : Boolean
  },
  { timestamps: { createdAt: 'created_on', updatedAt : 'updated_on' }}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

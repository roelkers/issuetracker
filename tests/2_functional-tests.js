/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
chai.config.includeStack = true;
suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          if(err){
            console.log(err);
          }
          assert.equal(res.status, 200, 'Status code is 200.' );
          assert.equal(res.body.issue_title,'Title', 'Title field is correct.');
          assert.equal(res.body.issue_text,'text', 'Text field is correct')
          assert.equal(res.body.created_by,'Functional Test - Every field filled in', 'Created_by field is correct.');
          assert.equal(res.body.assigned_to,'Chai and Mocha','Assigned_to field is correct.');
          assert.equal(res.body.status_text, 'In QA','Status_text field is correct.');
          assert.isString(res.body._id, '_id field exists.');
          assert.isString(res.body.updated_on, 'updated_on exists.');
          assert.isString(res.body.created_on, 'created_on exists.');
          assert.isBoolean(res.body.open, 'open field is true.');
          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
         .post('/api/issues/test2')
         .send({
           issue_title: 'Title',
           issue_text: 'text',
           created_by: 'Functional Test - Required fields filled in',
         })
         .end(function(err, res){
           if(err){
             console.log(err);
           }
           assert.equal(res.status, 200, 'Status code is 200.' );
           assert.equal(res.body.issue_title,'Title', 'Title field is correct.');
           assert.equal(res.body.issue_text,'text', 'Text field is correct')
           assert.equal(res.body.created_by,'Functional Test - Required fields filled in', 'Created_by field is correct.');
           assert.isString(res.body._id, '_id field exists.');
           assert.isString(res.body.updated_on, 'updated_on exists.');
           assert.isString(res.body.created_on, 'created_on exists.');
           assert.isBoolean(res.body.open, 'open field is true.');
           done();
         });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
         .post('/api/issues/test3')
         .send({
           issue_title: 'Title',
         })
         .end(function(err, res){
           assert.equal(res.status, 400, 'Status code is 400.' );
           done();
        });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {

      var _id;

      before(function(done){
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Put',
          created_by: 'Functional Test - put',
          assigned_to: 'Chai',
          status_text: 'wip'
        })
        .end(function(err,res){
          console.log('_id ' + _id)
          _id = res.body._id;
        });
        done();
      });

      test('No body', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({})
         .end(function(err, res){
           assert.equal(res.status, 400, 'Status code is 400.' );
           assert.equal(res.text, 'no updated field sent')
           done();
         });
      });

      test('One field to update', function(done) {

        var projectid;

        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id : _id,
           issue_title : 'New Title'
         })
         .end(function(err, res){
           if(err){
             console.log(err);
           }
           console.log(res.body.issue_title)
           assert.equal(res.status, 200, 'Status code is 200.' );
           assert.equal(res.body.issue_title,'New Title', 'Title field is correct.');
           assert.isString(res.body.updated_on, 'updated_on exists.');
           done();
         })
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id : _id,
           issue_title : 'New Title 2',
           issue_text : 'new issue text'
         })
         .end(function(err, res){
           if(err){
             console.log(err);
           }
           assert.equal(res.status, 200, 'Status code is 200.' );
           assert.equal(res.body.issue_title,'New Title 2', 'Title field is correct.');
           assert.equal(res.body.issue_text,'new issue text', 'new issue text is correct.');
           assert.isString(res.body.updated_on, 'updated_on exists.');
           done();
         })
      });
    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      var _id;

      before(function(done){
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title - Get',
          issue_text: 'Get',
          created_by: 'Functional Test - Get',
          assigned_to: 'Chai',
          status_text: 'wip'
        })
        .end(function(err,res){
          console.log('_id ' + _id)
          _id = res.body._id;
        });
        done();
      });

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          console.log(res.body[10])
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[10], 'issue_title');
          assert.property(res.body[10], 'issue_text');
          assert.property(res.body[10], 'created_on');
          assert.property(res.body[10], 'updated_on');
          assert.property(res.body[10], 'created_by');
          assert.property(res.body[10], 'assigned_to');
          assert.property(res.body[10], 'open');
          assert.property(res.body[10], 'status_text');
          assert.property(res.body[10], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
           issue_title : 'Title - Get'
        })
        .end(function(err, res){
          console.log(res.body[0]);
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_text, 'Get');
          done();
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
           issue_title : 'Title - Get',
           issue_text : 'Get'
        })
        .end(function(err, res){
          console.log(res.body[0]);
          assert.equal(res.status, 200);
          assert.equal(res.body[0].status_text, 'wip');
          done();
        });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      var _id;

      before(function(done){
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'To be deleted',
          created_by: 'Functional Test - To be deleted',
          assigned_to: 'Chai',
          status_text: 'wip'
        })
        .end(function(err,res){
          _id = res.body._id;
          console.log(_id)
        });
        done();
      });

      var invalidId = 3242;

      test('Invalid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/' + invalidId)
        .send()
        .end(function(err, res){
          console.log(res)
          assert.equal(res.status, 400);
          assert.equal(res.text, 'could not delete ' + invalidId);
          done();
        });
      });

      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/'+_id)
        .send()
        .end(function(err, res){
          //console.log(res)
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted '+_id);
          done();
        });
      });

    });

});

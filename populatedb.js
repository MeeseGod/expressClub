#! /usr/bin/env node

console.log('This script populates some test items to our database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Message = require('./models/message');
var User = require('./models/user');

const bcrypt = require("bcryptjs");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var messages = []
var users = []

function userCreate(firstName, lastName, userName, password, membership, cb) {
    bcrypt.hash(password, 10, (err, hashedpassword) => {
    var user = new User({ 
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: hashedpassword,
        membership: membership,
    });
       
    user.save(function (err) {
        if (err) {
        cb(err, null);
        return;
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user);
    });
  
    });
}
function messageCreate(messageText, postAuthor, datePosted, cb) {
    messagedetail = {
      messageText: messageText,
      datePosted: datePosted,
    }
    if (postAuthor != false) messagedetail.postAuthor = postAuthor
    
    var message = new Message(messagedetail);
         
    message.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New Message: ' + message);
      messages.push(message)
      cb(null, message)
    }  );
}

function createUsers(cb) {
  async.series([
    function(callback) {
        userCreate("John", "Smith", "JohnnyS", "password2", "user", callback)
    },
    function(callback) {
        userCreate("Jane", "Doe", "Jane28", "password2", "user", callback)
    },
    function(callback) {
        userCreate("Adam", "Smasher", "Arasaka", "password2", "admin", callback)
    },
  ],
  cb)
}

function createMessages(cb) {
  async.series([
    function(callback) {
        messageCreate("Hello", [users[0]], Date.now(), callback)
    },
    function(callback) {
        messageCreate("Yo", [users[1]], Date.now(), callback)
    },
  ],
  cb)
}

async.series([
    createUsers,
    createMessages,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Messages: '+messages);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
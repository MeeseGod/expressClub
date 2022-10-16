#! /usr/bin/env node

console.log('This script populates some test items to our database.');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const User = require("./models/user");
const Message = require("./models/message");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let users = []
let messages = []

function userCreate(firstName, lastName, userName, password, membership, cb){
    bcrypt.hash(password, 10, (err, hashedpassword) => {
        if(err){
            return err
        }
        userdetail = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: hashedpassword,
            membership: membership,
        };
    
        const user = new User(userdetail);
    
        user.save(function(err){
            if(err){
                cb(err, null);
                return;
            }
            console.log("New User: " + user);
            users.push(user);
            cb(null, user);
        });
    })
}

function messageCreate(messageText, postAuthor, datePosted, cb){
    messagedetail = {
        messageText: messageText,
        datePosted: datePosted,
    }
    if(postAuthor != false) messagedetail.postAuthor = postAuthor

    const message = new Message(messagedetail);

    message.save(function(err){
        if(err){
            cb(err, null);
            return;
        }
        console.log("New Message: " + message);
        messages.push(message);
        cb(null, message);
    })
}

function createUsers(cb){
    async.series([
        function(callback){
            userCreate("John", "Smith", "userSmith", "password2", "user", callback);
        },
        function(callback){
            userCreate("Jane", "Doe", "userJane", "password2", "user", callback);
        },
        function(callback){
            userCreate("Elizabeth", "Snow", "userSnow", "password2", "admin", callback);
        }
    ], cb)
}

function createMessages(cb){
    async.series([
        function(callback){
            messageCreate("Hey!", [users[0]], Date.now(), callback);
        },
        function(callback){
            messageCreate("Yo!", [users[1]], Date.now(), callback);
        },
    ], cb);
};

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
        console.log('Users: '+users);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




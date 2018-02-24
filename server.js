var express = require('express');
var mysql = require('mysql');
var app = express();
//Create connection database
var pool = mysql.createPool({
    host: 'localhost', //127.0.0.1
    user: 'hominh',
    password: 'emyeuanh1211',
    database: 'db_testsocket'
});
app.get('/user', function(req,res){
    var query = 'SELECT * FROM member';
    pool.query(query, function(error,result){
        if(error) throw error;
        console.log('– USER TABLE — ' , result);
        res.json(result);
    });
});

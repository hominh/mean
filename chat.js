var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent');
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost', //127.0.0.1
    user: 'hominh',
    password: 'emyeuanh1211',
    database: 'db_testsocket'
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});
app.get('/error', function(req, res){
  res.sendFile(__dirname + '/error.html');
});

app.get('/user', function(req,res){
    var query = 'SELECT * FROM member';
    pool.query(query, function(error,result){
        if(error) throw error;
        console.log('– USER TABLE — ' , result);
        res.json(result);
    });
});

io.on('connection', function(socket){

    socket.on('new_client', function(username){
        username = ent.encode(username);
        console.log(username);
        if(username === '') {
            console.log(username===blank);
            var destination = '/';
            socket.emit('redirect', destination);
        }
        else {
            var query = "SELECT * FROM `member` WHERE account = '" + username + "' AND password = '" + 123456 + "'";
            pool.query(query, function(error,result){
                if(result.length === 0 || error) {
                    var destination = '/error';
                    socket.emit('redirect', destination);
                }
                else {
                    console.log('– MEMBER — ' , result[0]);
                    socket.username = username;
                    socket.broadcast.emit('new_client', username);
                }
            });
        }

    });

    console.log('connected');
    socket.on('chat message', function(msg){
        msg = ent.encode(msg);
        console.log('message: ' + msg);
        io.emit('chat message', {username:socket.username,msg:msg});
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});

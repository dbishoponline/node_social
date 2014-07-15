'use strict';

// Module dependencies
var express = require('express'),
    colors = require('colors'),
    http = require('http'),
    path = require('path'),
    app = express(),
    server = http.createServer(app), // Create server
    io = require('socket.io').listen(server);

// Configure views
app.set('view engine', 'jade'); 
app.set('view options', { layout: true }); 
app.set('views', __dirname + '/views');

// Configure server
app.set('port', process.env.PORT || 3001);
app.use(express.favicon());

// Mount statics
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../client')));

// Route index.html
app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname, '../client/index.html'));
});

// route chat
app.get('/chat', function(req, res, next) {
    res.render('chat');
});

io.sockets.on('connection', function(socket) {
    var sendChat = function( title, text ) {
        socket.emit('chat', {
            title: title,
            contents: text
        }); };
    setInterval(function() {
        var randomIndex = Math.floor(Math.random()*catchPhrases.length)
        sendChat('Stooge', catchPhrases[randomIndex]);
    }, 5000);
    sendChat('Welcome to Stooge Chat', 'The Stooges are on the line');
    socket.on('chat', function(data){
        sendChat('You', data.text);
    });
});

app.get('/?', function(req, res){
    res.render('index');
});


// Start server
server.listen(app.get('port'), function() {
  console.log(
    'Express server listening on port '.green + app.get('port'),
    '\nPress Ctrl+C to shutdown'.grey
  );
});

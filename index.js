var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', function(req, res) {
  res.clearCookie('username');
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res) {
  if (req.cookies.username) {
    res.sendFile(__dirname + '/chat.html');
  } else {
    if (req.query.username) {
      res.cookie('username', req.query.username, { maxAge: 900000, httpOnly: false });
      res.sendFile(__dirname + '/chat.html');
    } else {
      res.redirect("/");
    }
  }
});

io.on('connection', function(socket) {
  console.log('user connected.');

  socket.on('ehlo', function(data) {
    io.emit('chat message', { username: data, msg: 'entered the room.' });
  });
  socket.on('chat message', function(data) {
    console.log('user sent msg:' + data.username);
    io.emit('chat message', data);
  });
});

http.listen(4000, function() {
  console.log('listening on *:4000');
});

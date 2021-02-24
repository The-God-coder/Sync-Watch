const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('index')
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("new_video", (arg) => {
        console.log(arg);
        socket.emit("new_video", arg.split('v=')[1])
        socket.broadcast.emit("new_video", arg.split('v=')[1])
      });  
    socket.on("playing", (arg) => {
      console.log(arg)
      socket.broadcast.emit('playing', arg)
    });  
    socket.on("paused", () => {
      socket.broadcast.emit('paused')

    });
    socket.on("controlling", () =>{
      socket.broadcast.emit('lost_control')
    });
    socket.on('chat message', msg => {
      io.emit('chat message', msg);
    });
    });
  

http.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`);
  });

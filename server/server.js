
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
let app=express();
let server=http.createServer(app);
let io=socketIO(server);
io.on('connection',(socket)=>{
     console.log('New user connected');
     socket.on('createMessage',(message,callback)=>{
         console.log('create message',message);
         io.emit('newMessage',generateMessage(message.from,message.text));
         callback("This is from the server");
        });
    socket.on('join',(params,callback)=>{
          if(!isRealString(params.name) && !isRealString(params.room)){
              callback('Name and room are required');
          }
          socket.join(params.room);
          socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));
          socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
          socket.leave()
          callback();
    })
    socket.on('createLocationMessage',(coords)=>{
          io.emit('newLocationMessage',generateLocationMessage('Admin',`${coords.latitude},${coords.longitude}`));
    });
       // socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
       // socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));
        socket.on('disconnect',()=>{
         console.log('User was disconnected');
     });
});
app.use(express.static(publicPath));
server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})
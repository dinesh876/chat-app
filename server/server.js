const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const {generateMessage,generateLocationMessage}=require('./utiles/message');
const {isRealString}=require('./utiles/validation');
const{Users}=require('./utiles/users');
let users=new Users();
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
let app=express();
let server=http.createServer(app);
let io=socketIO(server);
io.on('connection',(socket)=>{
     console.log('New user connected');
     socket.on('createMessage',(message,callback)=>{
         var user=users.getUser(socket.id);
         if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));      
         }
         callback("This is from the server");
        });
    socket.on('join',(params,callback)=>{
          if((!isRealString(params.name)) && !(isRealString(params.room))){
             return callback('Name and room are required');
          }
          socket.join(params.room);
          users.removeUser(socket.id);
          users.addUser(socket.id,params.name,params.room);
          io.to(params.room).emit('updateUserList',users.getUserList(params.room));
          socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));
          socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
          socket.leave()
          callback();
    })
    socket.on('createLocationMessage',(coords)=>{
         var user=users.getUser(socket.id);
         if(user){
          io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,`${coords.latitude},${coords.longitude}`));
         }
    });
        socket.on('disconnect',()=>{
            var user=users.removeUser(socket.id);
            if(user){
                io.to(user.room).emit('updateUserList',users.getUserList(user.room));
                io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
            }
     });
});
app.use(express.static(publicPath));
server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})
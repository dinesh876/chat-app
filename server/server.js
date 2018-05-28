
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
let app=express();
let server=http.createServer(app);
let io=socketIO(server);
io.on('connection',(socket)=>{
     console.log('New user connected');
     socket.on('createMessage',(message)=>{
         console.log('create message',message);
         io.emit('newMessage',{
             from:message.from,
             text:message.text,
             createdAt:new Date().getTime()
         })
        })
        //Welcome message from the admin to the individual user
        socket.emit('newMessage',{
            from:"Admin",
            text:"Welcome to the chat app",
            createdAt:new Date().getTime()
        })
        //broadcast to the all the user when the new user join the conversion
        socket.broadcast.emit('newMessage',{
            from:"Admin",
            text:"New user joined",
            createdAt:new Date().getTime()
        })
    //Welcome message from the admin to the individual user
     socket.on('disconnect',()=>{
         console.log('User was disconnected');
     });
});
app.use(express.static(publicPath));
server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})
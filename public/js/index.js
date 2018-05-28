var socket=io();
socket.on('connect',function(){
     console.log('connected to server');
     /*socket.emit('createMessage',{
         "from":"dinesh",
         "text":"can we meet up at 6 p.m"
     })*/
})
socket.on('disconnect',function(){
    console.log("server went down!!!");
})
socket.on('newMessage',function(message){
    console.log("newMessage",message);
})

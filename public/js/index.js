var socket=io();
var locationButton=jQuery("#send-location")
socket.on('connect',function(){
     console.log('connected to server');
});
socket.on('newMessage',function(message){
    var formattedTime=moment(message.createdAt).format('hh:mm a');
    console.log("newMessage",message);
    var li=jQuery('<li></li>');
    li.text(`${message.from}  ${formattedTime}:${message.text}`);
    jQuery("#messages").append(li);
});
socket.on('newLocationMessage',function(message){
    var formattedTime=moment(message.createdAt).format('hh:mm a');
    var li=jQuery("<li></li>");
    var a=jQuery('<a target="_blank">My current Location</a>');
    li.text(`${message.from} ${formattedTime}:`);
    a.attr('href',message.url);
    li.append(a);
    jQuery("#messages").append(li);
})
socket.on('disconnect',function(){
    console.log("server went down!!!");
});
jQuery("#message-form").on("submit",function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'user',
        text:jQuery('[name=message]').val()
    },function(data){
        console.log("Got it ", data);
    })
    $('[name=message]').val("");
});
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert("Geolocation not supported by your browser");
    }
    locationButton.attr('disabled','disabled').text('Sending Location....');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location'); 
        socket.emit('createLocationMessage',{
             latitude:position.coords.latitude,
             longitude:position.coords.longitude
         })
    },function(){
        locationButton.removeAttr('disabled').tetx('Send Location')
       alert("unable to fetch location.");
    });
});


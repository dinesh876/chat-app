var socket=io();
var locationButton=jQuery("#send-location")
function scrollToBottom(){
     var messages=$('#message');
     var newMessage=messages.children('li:last-child');
     var newMessgaeHeight=newMessage.innerHeight();
     var lastMessageHeight=newMessage.prev().innerHeight();
     var clientHeight=messages.prop('clientHeight');
     var scrollTop=messages.prop('scrollTop');
     var scrollHeight=messages.prop('scrollHeight');
     if(clientHeight+scrollTop+newMessgaeHeight+lastMessageHeight>=scrollHeight){
         messages.scrollTop(scrollHeight);
     }
}
socket.on('connect',function(){
    var params=$.deparam(window.location.search);
    socket.emit('join',params,function(err){
       if(err){
           window.location.href='/';
       }
       else{
          console.log('No error');
       }
    });
     //console.log('connected to server');

});
socket.on('newMessage',function(message){
    var formattedTime=moment(message.createdAt).format('hh:mm a');
    var template=$('#message-template').html();
    var html=Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime
   });
    $('#messages').append(html);
    scrollToBottom();
});
socket.on('newLocationMessage',function(message){
    var formattedTime=moment(message.createdAt).format('hh:mm a');
    var template=$('#location-message-template').html();
    var html=Mustache.render(template,{
        from:message.from,
        url:message.url,
        createdAt:formattedTime
   });
    $('#messages').append(html);
    scrollToBottom();                
});
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


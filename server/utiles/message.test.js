let expect=require('expect');
let {generateMessage,generateLocationMessage}=require('./message');
describe('generateMessage',()=>{
    it('should generate correct message object',()=>{
        var from='jax';
        var text="some message";
        var message=generateMessage(from,text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});
    })
 })
 describe('generateLocationMessage',()=>{
     it('should generate correct location object',()=>{
         var from='jazmne';
         var latitude=15;
         var longitude=19;
         var url='https://www.google.com/maps?q=15,19';
         var message=generateLocationMessage(from,latitude,longitude);
         expect(message.createdAt).toBeA('number');
         expect(message).toInclude({from,url});
     })
 })
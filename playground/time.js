var moment=require('moment');
var date=moment();
//console.log(date.getMonth());
//console.log(date.getDay());
//console.log(`${date.getHours()}:${date.getMinutes()}`);
console.log(date.format('Do MMMM YYYY'));
console.log(date.format('hh:mm A'))
console.log(moment().valueOf());

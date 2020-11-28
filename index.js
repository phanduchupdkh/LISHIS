var hl7 = require('simple-hl7');
const fs = require('fs')
 
///////////////////SERVER/////////////////////
var app = hl7.tcp();
 
app.use(function(req, res) {
  //req.msg is the HL7 message
  console.log('******message received*****')
  console.log(req.msg.log());
  let oldData = fs.readFileSync('data.json','utf-8')
  oldData = oldData + '\n==============================\n' + req.msg.log() 
  fs.writeFileSync('data.json',oldData,'utf-8')
  
  // var msa = res.ack.getSegment('MSA')
  // msa.setField(1, '');
  
  res.end()
})
 
 
// Listen on port 7777
app.start(7777);
///////////////////SERVER/////////////////////

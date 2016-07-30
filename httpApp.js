var http = require('http');

var server = http.createServer(function(request, response) {
  var body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    var obj = JSON.parse(Buffer.concat(body).toString());

    console.log("FROM: " + obj.envelope.from);
    console.log("TO: " + obj.envelope.to);
    console.log("SUBJECT: " + obj.headers.Subject);
    console.log("BODY: " + obj.plain);

    response.writeHeader(200);
  });
});

server.listen(3000, function(){
  console.log("SERVER RUNNING");
});

'use strict';
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route(
    [
        {
            method: "GET",
            path: "/path/{user}",
            handler: function(request, reply){
                pathHandler(reply, request.params.user);
            }
        },
        {
            method: "POST",
            path: "/incomingMail",
            handler: function(request, reply){
                emailHandler(request, reply);
            }
        }
    ]
);

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

function pathHandler(reply, name){
     reply ("HELLO!!" + name);
}

/** Error handler support */
function emailHandler(request, reply){
    var data = request.payload;

    console.log("FROM: " + data.envelope.from);
    console.log("TO: " + data.envelope.to);
    console.log("SUBJECT: " + data.headers.Subject);
    console.log("TEXT: " + data.plain);
    console.log("****************************************");

    reply("OK!");
}
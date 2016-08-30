'use strict';
const Hapi = require('hapi');

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const server = new Hapi.Server();
server.connection({port: process.env.PORT});

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
    reply ("HELLO!!  " + name);
}

/** Error handler support */
function emailHandler(request, reply){
    reply("OK!");

    var data = request.payload;

    var incomingFrom = data.envelope.from;
    var incomingTo = data.envelope.to;
    var incomingSubject =  data.headers.Subject;
    var incomingPlain =  data.plain;

    console.log("GET MESSAGE FROM:" + incomingFrom);

    /** SENDGRID PART */
    var helper = sg.mail;
    var from_email = new helper.Email('HEROKU_APP');
    var to_email = new helper.Email(incomingFrom);
    var subject = 'EMAIL_APP RESPONSE';
    var content = new helper.Content('text/plain', 'Hello, Email!');
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sgRequest = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(sgRequest, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

}
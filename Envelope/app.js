'use strict';
const Hapi = require('hapi');
const Joi = require('joi');

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const server = new Hapi.Server();
server.connection({port: process.env.PORT || 3000});

server.route(
    [
        {
            method: "GET",
            path: "/path/{user}",
            handler: function(request, reply){
                pathHandler(reply, request.params.user);
            },
            config: {
                validate: {
                    params: {
                        user: Joi.string().min(1).max(3)
                    }
                }
            }
        },
        {
            method: "POST",
            path: "/incomingMail",
            handler: function(request, reply){
                emailHandler(request, reply);
            }
        },
        {
            method: "POST",
            path: "/admin",
            handler: function(request, reply){
                adminHandler(request, reply);
            }/*,
            config: {
                validate: {
                    payload: {
                        keys: [
                            "password"
                        ]
                    }
                }
            }*/
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

    console.log("GET MESSAGE:");
    console.log(data);
    console.log("****************************");
    console.log(data.envelope);
    console.log(data.envelope.from);
/*
    /!** SENDGRID PART *!/
    var helper = sg.mail;
    var from_email = new helper.Email('barejra@list.ru');
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
*/

}

function adminHandler(request, reply){
    console.log(request.payload + ": " + request.payload.password);

    /*if(request.payload.password){
        var data = request.payload;
        var pas = data.password;
        var adminPas = "123";

        if(pas == adminPas){
            console.log("GET ADMIN! PAS: " + pas);
            reply("HELLO ADMIN!");
          }else{
            console.log("GET WRONG ADMIN PASSWORD");
            reply("ADMIN PASSWORD IS NOT VALID!");
        }
    }else{
        console.log("GET WRONG ADMIN POST!");
        reply("ADMIN IS NOT AUTHORIZED!");
    }*/
}
"use strict";

/** GOOGLE LIBRARIES  ***************************/
// Imports the Gmail client library
var google = require('googleapis');

module.exports = function () {
    return {
        /** Error handler support */
        subscribtionPushHandler: function (request, reply) {
            reply('OK');

            var data = request.payload;

            console.log("GET MESSAGE FROM PUBSUB:");
            console.log(data);
            console.log("****************************");
        },

        subscribtionPullConnection: function (auth) {
            // Imports the Google Cloud client library
            var PubSub = require('@google-cloud/pubsub');

            // Your Google Cloud Platform project ID
            var projectId = '941155794978';

            // Instantiates a client
            var pubsubClient = PubSub({
                projectId: projectId
            });

            var topic = pubsubClient.topic('myTopic');
            var subscription = topic.subscription('MySub2');

            // Register an error handler.
            subscription.on('error', function (err) {
                console.error("SUBSCRIBTION ERROR: ", err);
            });

            // Register a listener for `message` events.
            function onMessage(message) {
                // Called every time a message is received.

                // message.id = ID of the message.
                // message.ackId = ID used to acknowledge the message receival.



                // Ack the message:
                message.ack(function () {
                    printMessage(auth, message);
                });

                // Skip the message. This is useful with `maxInProgress` option when
                // creating your subscription. This doesn't ack the message, but allows
                // more messages to be retrieved if your limit was hit.
                // message.skip();
            }

            subscription.on('message', onMessage);
        }
    };

    function printMessage(auth, message){
        if(typeof message == "string"){
            console.log("PUBSUB MESSAGE: ", message.data);
        }else{
            console.log("PUBSUB GET EMAIL: ", message.data);

            var emailHistoryId = message.data.historyId;

            var gmail = google.gmail('v1');
            /** GMAIL REQUEST******************************** */
            gmail.users.history.list({
                auth: auth,
                userId: 'me',
                startHistoryId: emailHistoryId
            }, function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }

                var arr = (response.history);
                console.log(arr);
                for(var item of arr) {
                    var arr2 = item.messages;
                    for(var item2 of arr2) {
                        console.log(item2);

                        gmail.users.messages.get({
                            auth: auth,
                            userId: 'me',
                            id: item2.id
                        }, function (err, response) {
                            if (err) {
                                console.log('The API returned an error: ' + err);
                                return;
                            }

                            var headersArr = response.payload.headers;
                            for(var item3 of headersArr) {
                                if(item3.name == "From")
                                console.log(item3.value);
                            }

                        })
                    }
                }
            });
            /** GMAIL REQUEST******************************** */
        }
    }

}();



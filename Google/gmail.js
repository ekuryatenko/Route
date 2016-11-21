"use strict";

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

        subscribtionPullConnection: function () {
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
                console.log(message.data);

                // Ack the message:
                message.ack(function () {
                    console.log("MESSAGE GET");
                });

                // Skip the message. This is useful with `maxInProgress` option when
                // creating your subscription. This doesn't ack the message, but allows
                // more messages to be retrieved if your limit was hit.
                // message.skip();
            }

            subscription.on('message', onMessage);
        }
    };
}();



var restify = require('restify');
var builder = require('botbuilder');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Hi! This is SUREBot!");
        builder.Prompts.text(session, "To get started, what's your first name and UTEID (separate by a space e.g. Jason he1881)?");
    },
    function (session, results) {
        session.send("Got your name!");
        session.dialogData.userName = results.response;
        session.send("Let's return your information");
        // Process request and display reservation details
         session.send(`Reservation confirmed. Reservation details: Name: ${session.dialogData.userName}`);
         session.endDialog();
    }
]);
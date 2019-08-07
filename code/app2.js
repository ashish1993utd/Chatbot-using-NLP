var builder = require('botbuilder');
var restify = require('restify');
require('dotenv-extended').load();

//import { botCreate } from './bot.js';

/* To connect with console
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);
*/

// Bot Modules
var BotSystem = require('./bot_core/system2.js');

//====================================================
// BOT SETUP
//====================================================

// Setup Restify Server: Create a new server instance
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening...',server.name);
});


//Create CHATBOT
var connector = new builder.ChatConnector({
  // appId: 'e504f4d4-e45f-4110-87a7-edf9e5bebfed',
  // appPassword: 'wmwfSJMM190?|+pbpOWU62_'
  appId:'',
  appPassword:''
});

// connector usage in bot creation method
// botCreate(connector);

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);
//server.post('/api/messages',connector.listen()); // This registers bot service object on publically 
// accessible api/messages http end point where node.js will be running

/*
* Add LUIS as a recognizer
* Get the LUIS model url from the environment
*///connect to LUIS
/*bot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));
*/

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
var recon = bot.recognizer(recognizer);
server.post("/api/messages",connector.listen());

// init bot system module and connect to MySQL Database
var system = new BotSystem();
system.connectToDB(); 


//====================================================
// BOT DIALOG
//====================================================

bot.dialog('/ask_name',[
    function (session) {
    builder.Prompts.text(session,'Hi! What is your name?');
    },
    function (session,results) {
        session.userData.name=results.response;  
       session.endDialog();
    }
]);

//==================================================================================
// MAIN DIALOG
//=================================================================================




var intents = new builder.IntentDialog({ recognizers: [recon] });
bot.dialog('/',intents);

intents.onDefault([
    function (session,args,next) {
        if(!session.userData.name){
            session.beginDialog('/ask_name');
        }
        else{
            next();
        }
    },
    function (session) {
        session.send('Welcome %s... I am your smart assistant. \n Ask me a question...'
        ,session.userData.name);  
        session.endDialog();
    }   
]);


bot.dialog('/sales',[
    function (session, args) {
        
        // Entity recognition once th intent is recognized
        var intent = args.intent;
        var mon = builder.EntityRecognizer.findEntity(intent.entities, 'month');
        var year = builder.EntityRecognizer.findEntity(intent.entities, 'year');
        var city = builder.EntityRecognizer.findEntity(intent.entities, 'city');
        var agg = builder.EntityRecognizer.findEntity(intent.entities, 'agg');
        var max = builder.EntityRecognizer.findEntity(intent.entities, 'maximum');
        var min = builder.EntityRecognizer.findEntity(intent.entities, 'minimum');
        var state = builder.EntityRecognizer.findEntity(intent.entities, 'Province');
        var territory = builder.EntityRecognizer.findEntity(intent.entities, 'Territory');
        
        if (state){
            session.place='State Province'
            }
        else if (territory){
            session.place = 'Sales Territory' 
        }
        else if(city){
            session.place='City'
        }

        if(max && !min && !agg && !mon && !year){
            system.query2(session)
        }
       else if(max && !min && !agg && mon && year){
             session.month = mon.entity;
            if(year.entity==='this year'){
                session.year=2016
            }
            else if(year.entity==='last year' || year.entity==='previous year'){
                session.year = 2015
            }
            else{
             session.year = year.entity;
            }
             system.query2(session)
        }
        else if(max && !min && !agg && mon && !year){
            session.month = mon.entity;
           system.query2(session)
       }
       else if(max && !min && !agg && !mon && year){
        if(year.entity==='this year'){
            session.year=2016
        }
        else if(year.entity==='last year' || year.entity==='previous year'){
            session.year = 2015
        }
        else{
         session.year = year.entity;
        }
       system.query2(session)
   }
// Query 1 Average
        else if(agg && !max && !min && !mon && !year){
            system.query1(session)
        }
       else if(agg && !min && !max && mon && year){
             session.month = mon.entity;
             if(year.entity==='this year'){
                session.year=2016
            }
            else if(year.entity==='last year' || year.entity==='previous year'){
                session.year = 2015
            }
            else{
             session.year = year.entity;
            }
            system.query1(session)
        }
        else if(agg && !min && !max && mon && !year){
            session.month = mon.entity;
           system.query1(session)
       }
       else if(agg && !min && !max && !mon && year){
        if(year.entity==='this year'){
            session.year=2016
        }
        else if(year.entity==='last year' || year.entity==='previous year'){
            session.year = 2015
        }
        else{
         session.year = year.entity;
        }
       system.query1(session)}
       
        // Query 3 Minimum
        else if(min && !max && !agg && !mon && !year){
         system.query3(session)
        }
        else if(min && !max && !agg && mon && !year){
            session.month = mon.entity;
            system.query3(session)
        }
        else if(min && !max && !agg && mon && year){
            session.month = mon.entity;
            if(year.entity==='this year'){
                session.year=2016
            }
            else if(year.entity==='last year' || year.entity==='previous year'){
                session.year = 2015
            }
            else{
             session.year = year.entity;
            }
            system.query3(session)
        }
        else if(min && !max && !agg && !mon && year){
            if(year.entity==='this year'){
                session.year=2016
            }
            else if(year.entity==='last year' || year.entity==='previous year'){
                session.year = 2015
            }
            else{
             session.year = year.entity;
            }
            system.query3(session)
        }

     

}]).triggerAction({
    matches: "getsales" //// dialog triggered from intent received from LUIS app.
});


bot.dialog('/none',[
    function (session) {    
        session.send('Oops! I didn\'t get that!');
        session.endDialog();        
    }]).triggerAction({
    matches: "None" //// dialog triggered from intent received from LUIS app.
});









////////////////////////   RELEVANT CODE ABOVE //////////////////////////////////////////////////

// CITY AND TRANSACTIONS INTENT
/*
bot.dialog('/city',[
    function (session) {    
        session.userData.salesintent='city'; 
        system.luisques(session);
    }]).triggerAction({
    matches: "getcity" //// dialog triggered from intent received from LUIS app.
});


bot.dialog('/transactions',[
    function (session) {    
        session.userData.salesintent='transactions'; 
        system.luisques(session);
    }]).triggerAction({
    matches: "gettransactions" //// dialog triggered from intent received from LUIS app.
});
*/



/*
bot.dialog('SearchHotels', [
    (session, args, next) => {
        session.send(`Welcome to the Hotels finder! We are analyzing your message: 'session.message.text'`);
        // try extracting entities
        const cityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city');
        const airportEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'AirportCode');
        if (cityEntity) {
            // city entity detected, continue to next step
            session.dialogData.searchType = 'city';
            next({ response: cityEntity.entity });
        } else if (airportEntity) {
            // airport entity detected, continue to next step
            session.dialogData.searchType = 'airport';
            next({ response: airportEntity.entity });
        } else {
            // no entities detected, ask user for a destination
            builder.Prompts.text(session, 'Please enter your destination');
        }
    },
    (session, results) => {
        const destination = results.response;
        let message = 'Looking for hotels';
        if (session.dialogData.searchType === 'airport') {
            message += ' near %s airport...';
        } else {
            message += ' in %s...';
        }
        session.send(message, destination);
        // Async search
        Store
            .searchHotels(destination)
            .then(hotels => {
                // args
                session.send(`I found ${hotels.length} hotels:`);
                let message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(hotels.map(hotelAsAttachment));
                session.send(message);
                // End
                session.endDialog();
            });
    }
]).triggerAction({
    matches: 'SearchHotels',
    onInterrupted:  session => {
        session.send('Please provide a destination');
    }
});
*/



////////////////////////////////////////////////////////////

intents.matches(/^change name/i,[
    function(session){
        session.beginDialog('/ask_name');
    },
    function(session,results){
        session.send('ok... Changed your name to %s',session.userData.name);
    }    
]);


//======================
// Sending Bot version
intents.matches(/^version/i,builder.DialogAction.send('Bot Version 1.0.0'));
//======================





//==================================================================================
// Basic message from Console - Hello World
//=================================================================================


/*var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session){
    session.send('Hello World');
});
*/

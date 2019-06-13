var mysql = require('../node_modules/mysql');

// msql config
var mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Safari5610#',
    database: 'bot'
};

// export functions
module.exports = function() {
    this.connectToDB = connectToDB;
    this.checkques = checkques;
}

// Connection to DB
var connection;

// Connect to MySQL DB
connectToDB = function() {
    connection = mysql.createConnection(mysqlConfig);
    connection.connect(function(err){
        // The server is either down or restarting
        if (err){
            // We introduce a delay before attempting to reconnect,
            // to avoid a hot loop, and to allow our node script to
            // process asynchronous requests in the meantime
            setTimeout(connectToDB,2000);
        }
    });

    connection.on('error', function(err){
        systemMessage('db error: ' + err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            connectToDB();
        }
        else{
            throw err;
        }
    });
}

// Display log message in console
systemMessage = function(message){
    console.log('=================================');
    console.log(message);
    console.log('=================================');
}



// Checking answer to the question from our database

checkques = function(session){
    //find question
    connection.query('SELECT * FROM cricket WHERE ques=? LIMIT 1', [
        session.userData.question
    ],
    function(err,rows, fields){
        if(!err){
            if(rows[0]!==undefined){
                session.userData.question_id = rows[0].ques_id;
                    if(session.userData.question_id===1)
                     {
                         session.send('Australia 259/8 in 48.5 overs');
                         session.beginDialog('/more_ques');
                     }
                else if(session.userData.question_id===2)
                     {
                      session.send('India Vs. Pakistan is scheduled on 16th June 4:30 a.m. CST at Lords');
                      session.beginDialog('/more_ques');
                     }
                else if(session.userData.question_id===3)
                     {
                         session.send('India is leading the points table with 10 points in 5 matches');
                         session.beginDialog('/more_ques');
                     }
             else if(session.userData.question_id===4)
                     {
                      session.send('England beat West Indies by 5 wickets');
                      session.beginDialog('/more_ques');
                     }
            else if(session.userData.question_id===5)
                     {
                    session.send('World Cup final : 5th July, 2019 in London at 4:30 a.m. CST');
                    session.beginDialog('/more_ques');
                     }
            else{
                session.send("Sorry I didn't get you");
                session.beginDialog('/more_ques');
            }
        }
            else {
                session.send("Sorry I didn't get you");
                session.beginDialog('/more_ques');
            }
        
        }
        else{
            session.send('Error from DB %s',err);
            }
    
    });
};

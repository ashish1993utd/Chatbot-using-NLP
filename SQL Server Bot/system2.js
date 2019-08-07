////////////////////////////////////////////////////////////////////////////////////

// export functions
module.exports = function() {
    this.connectToDB = connectToDB;
    this.luisques = luisques;
    this.query1 = query1;
    this.query2 = query2;
    this.query3 = query3;
}

// Connection for mssql
var mssql = require("../node_modules/mssql");

// mssql config
var dbConfig = {
    server:"DESKTOP-3NE93V7\\SQLEXPRESS",
    database:"WideWorldImportersDW",
    user:"nick",
    password:"Safari5610#",
    port:1433
}

// SQL server connection
// Connection to DB for Mysql
var conn;
connectToDB=function(){
    conn = new mssql.ConnectionPool(dbConfig);
    conn.connect(function (err){
        if (err){
            console.log(err);
            return;
        }
    });
}

luisques = function(session){
    //var req = new mssql.Request(conn);
    var city = session.userData.question;
    //var sql = "Select TOP 5 City, \"State Province\", \"Sales Territory\" from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] WHERE City = '" + city + "'" 

    var sql = "Select TOP 5 City, \"State Province\", \"Sales Territory\", \"Total Including Tax\"  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] ORDER BY 4 DESC" 
          
    
    conn.query(sql,function (err, rows, fields){
    if(err){
        console.log(err);
        return;
    }
    else{
        var results=JSON.stringify(rows.recordset);
        session.send(results); 
        console.log(rows.recordset[3].City);
        session.send(rows.recordset[4].City)
        session.endDialog();    
    }
    //conn.close()
})};




// Query 1 for Average Sales in a city
query1 = function(session){
    var place = session.place;
    if(!session.month && !session.year)
    {   
        var sql = "Select TOP 5 [" + place + "], AVG(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] GROUP BY [" + place + "] ORDER BY 2 DESC" ;
    }
    else if(session.month && !session.year){
        var xo = session.month;
        var sql = "Select TOP 5 [" + place + "], Month, AVG(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE month = '" + xo + "' GROUP BY [" + place + "], Month ORDER BY 3 DESC" ;
    }
    else if(session.month && session.year){
        var xo = session.month;
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], AVG(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ " AND Month='" + xo + "')  GROUP BY [" + place + "] ORDER BY 2 DESC" ;
         }
    else if(!session.month && session.year){
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], AVG(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ ")  GROUP BY [" + place + "] ORDER BY 2 DESC" ;
             }

     conn.query(sql,function (err, rows, fields){
     if(!err){
         var results=JSON.stringify(rows.recordset);
         session.send(results); 
         console.log(rows.recordset);
         session.endDialog();
     }
     else{
         console.log(err);
         return;
     }
 })};


// Query 2 for Maximum Sales in a city
query2 = function(session){
    var place = session.place;
    if(!session.month && !session.year)
    {
        var sql = "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] GROUP BY [" + place + "] ORDER BY 2 DESC" ;
    }
    else if(session.month && !session.year){
        var xo = session.month;
        var sql = "Select TOP 5 [" + place + "], Month, SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE month = '" + xo + "' GROUP BY [" + place + "], Month ORDER BY 3 DESC" ;
    }
    else if(session.month && session.year){
        var xo = session.month;
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ " AND Month='" + xo + "')  GROUP BY [" + place + "] ORDER BY 2 DESC" ;
         }
    else if(!session.month && session.year){
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ ")  GROUP BY [" + place + "] ORDER BY 2 DESC" ;
             }
    conn.query(sql,function (err, rows, fields){
    if(!err){
        var results=JSON.stringify(rows.recordset);
        session.send(results); 
        console.log(rows.recordset);
        session.endDialog();
    }
    else{
        console.log(err);
        return;
    }
})};


// Query 3 for Minimum Sales in a city
query3 = function(session){ 
    var place = session.place;
    if(!session.month && !session.year)
    {
        var sql = "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] GROUP BY City ORDER BY 2" ;
    }
    else if(session.month && !session.year){
        var xo = session.month;
        var sql = "Select TOP 5 [" + place + "], Month, SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE month = '" + xo + "' GROUP BY [" + place + "], Month ORDER BY 3 " ;
    }
    else if(session.month && session.year){
        var xo = session.month;
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ " AND Month='" + xo + "')  GROUP BY [" + place + "] ORDER BY 2" ;
         }
    else if(!session.month && session.year){
        var yr = session.year;
        var sql =  "Select TOP 5 [" + place + "], SUM(\"Total Including Tax\")  from Fact.Sale s inner Join Dimension.City c ON s.[City Key]=c.[City Key] inner join Dimension.Date d ON s.[Delivery Date Key]=d.Date WHERE  (d.[Calendar Year]=" +yr+ ")  GROUP BY [" + place + "] ORDER BY 2" ;
             }

    conn.query(sql,function (err, rows, fields){
     if(!err){
         var results=JSON.stringify(rows.recordset);
         session.send(results); 
         console.log(rows.recordset);
         session.endDialog();
     }
     else{
         console.log(err);
         return;
     }
 })};





//////  Database LUIS Integration
/*
luisques = function(session){
    //find answer from the table when intent is getsales
    // rows is returned from SQL query that we run
    connection.query('SELECT answer FROM LUIS_INTEGRATION WHERE intent=? LIMIT 1', [
        session.userData.salesintent
    ],
    function(err,rows, fields){
        if(!err){
            if(rows[0]!==undefined){
                session.userData.send_answer = rows[0].answer;
                session.send(session.userData.send_answer);
                session.endDialog();
            }
            else{
                session.send("Sorry I didn't get you");
                session.endDialog();
            }    
        }
        else{
            session.send('Error from DB %s',err);
            }
    });
};
*/

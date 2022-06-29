require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const item = require("./routes/item");
const database = require("./database/connection");
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session); // to store session info in MongoDB



//database connection
mongoose.connect(
  database.connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(connection => {
    console.log("connection stablished")
  })
  .catch(error => {
    console.log(database);
    console.log({
      error: {
        name: error.name,
        message: error.message,
        errorCode: error.code,
        codeName: error.codeName
      }
    })
  });



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Setting up CORS, such that it can work together with an Application at another domain / port
 */
app.use(
  cors({
    origin: ["http://localhost:4200"],
    credentials: true
  }));


//store session created in mong db 
const userStore = new MongoDBSession({
  uri: database.connection,
  collection: 'user_session'
})

//create session
app.use(session({
  secret: 'secret',
  resave: false,  //'true' menas for every req to server, we want to create a new session and we don't want to care about if it's a same user/browser
  saveUninitialized: false, //if we have not touched or modified the session, we don't want it to be saved.
  store: userStore,
  cookie: {
    maxAge: 1000 * 60, //1 min expiry 
    secure: false,
    httpOnly:false,
  }

  //check this in atul's code
  // cookie:{
  //   path:"/",
  //   maxAge: 1000 * 60 * 60 * 2,
  //   secure:true,
  //   httpOnly:false,
  //   domain : true //check it 
  // }
}))




// app.use((req, res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*"); 
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");  
//     //check for the options request from browsers
//     //this will always be sent
//     if(req.method === "OPTIONS"){
//         //tell the browser what he can ask for
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         //we just respond with OK status code
//         return res.status(200).json({
//             "statusMessage": "ok"
//         });
//     }

//     next();
// });

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});



app.use("/", item);

//session
// app.get("/", (req,res)=>{
//   console.log('hii')
//   req.session.isAuth = true;  //cookie gets created bcz of this
//   console.log('session :: ',req.session);
//   console.log('session id :: ', req.session.id); //part of sid present in browser - cookie... this id is used to mintain session for some user
//   res.send("hello session tut");
// })


// Error message is send if router doesn't exist
app.use((req, res, next) => {
  const error = new Error("Unable to manage the request");
  //send a status code error
  error.status = 404;
  //forward the request with the error
  next(error);
})

//error message 
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    "error": {
      "message": error.message
    }
  })
});



//create the server
app.listen(port, () => {
  console.log("Server is running @ localhost:8080");
});



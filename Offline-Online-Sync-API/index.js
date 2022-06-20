require('dotenv').config();
const express = require("express");
const server = express();
const bodyParser= require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const item = require("./routes/item");
const database = require("./database/connection");



//body parser for the params
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());

//user CORS
server.use(cors());



//database connection
mongoose.connect(
    database.connection, { useNewUrlParser: true })
  .then(connection => {
    console.log("connection stablished")
  })
  .catch(error => {
    console.log(database);
    console.log({
        error : {
            name : error.name,
            message : error.message,
            errorCode: error.code,
            codeName: error.codeName
        }
    })
  });

  server.use((req, res, next)=>{
    //we say what we want to allow, you can whitelist IPs here or domains
    res.header("Access-Control-Allow-Origin", "*"); 
    //what kind of headers we are allowing
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");  

    //check for the options request from browsers
    //this will always be sent
    if(req.method === "OPTIONS"){
        //tell the browser what he can ask for
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        //we just respond with OK status code
        return res.status(200).json({
            "statusMessage": "ok"
        });
    }
   
    next();
});

server.use("/", item);


// Error message is send if router doesn't exist
server.use((req,res,next)=>{
  const error = new Error("Unable to manage the request");
  //send a status code error
  error.status= 404;
  //forward the request with the error
  next(error);
})

//error message 
server.use((error, req, res, next)=>{
  res.status(error.status || 500);
  res.json({
      "error": {
          "message": error.message
      }
  })
});




const port = process.env.PORT || 8080;


//create the server
server.listen(port, ()=>{
    console.log("Server is running @ localhost:8080");
});



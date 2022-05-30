const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const Mongoose = require("mongoose");
const https = require('https');

router.get("/todos", (req, res, next) => {
  //return all items
  const todos = TodoModel.find({}, (err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        data: todos
      });
    }
  })
});

//add an item
router.post("/todos", (req, res, next) => {
  console.log(req.body);

  let newtodo = new TodoModel({
    _id: new Mongoose.Types.ObjectId(),
    title: req.body["title"],
    content: req.body["content"],
    done: req.body["done"]
  });

  newtodo.save((err) => {
    if (err) {
      res.status(400).json({
        message: "The Todo data was not saved",
        errorMessage: err.message
      })
    } else {
      res.status(201).json({
        message: "Todo data was saved successfully"
      })
    }
  })

});


router.post("/bulk", (req, res, next) => {
  console.log(req.body);

  TodoModel.insertMany(req.body, (err, docs) => {
    if (err) {
      res.status(400).json({
        message: "The Todos were not saved",
        errorMessage: err.message
      })
    } else {
      res.status(200).json({
        message: "Bulk document creation successful",

      })
    }
  })

})

// delete an item
router.delete("/todo/:id", (req, res, next) => {

  let id = req.body._id;
  console.log(id);


  let todoToDelete = TodoModel.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.status(404).json({
        message: "Item was not found",
      });
    } else {
      res.status(200).json({
        message: "Item was deleted successfully",
      });
    }

  })

});


router.delete("/bulkDelete", (req, res, next) => {
  console.log(req.body);
  TodoModel.deleteMany({ _id: { $in: req.body } }, (err, response) => {
    if (err) {
      res.status(404).json({
        message: "todos not found",
      });
    } else {
      res.status(200).json({
        message: response,
      });
    }
  })
})


router.get("/entries", (req, res, next) => {
  const options = {
    hostname: 'api.publicapis.org',
    port: 443,
    path: '/entries',
    method: 'GET',
  };
  
  const result = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    result.on('data', d => {
      process.stdout.write(d);
    });
  });
  
  result.on('error', error => {
    console.error(error);
  });
  
  result.end();
});



module.exports = router;
const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const Mongoose = require("mongoose");
const https = require('https');
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");  //so that passwords are not recognized or changed by anyone



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
  let newtodo = new TodoModel({
    _id: new Mongoose.Types.ObjectId(),
    title: req.body["title"],
    content: req.body["content"]
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
  TodoModel.deleteOne({ _id: id }, (err) => {
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
  https.get('https://api.publicapis.org/entries', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.status(200).send(data)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  })


});



router.post("/login",  (req, res, next) => {
  const { custEmail, custPassword } = req.body;

  UserModel.findOne({email : custEmail}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log('user :: ', user)
      if (!user) {
        return res.redirect('/login');
      }
      else{
       // const isMatch = await bcrypt.compare(custPassword, user.password)
        const isMatch =  bcrypt.compare(custPassword, user.password)
        if(!isMatch){
          return res.redirect('/login')
        }
      
        res.redirect('landing-page');
      }

      // res.status(200).json({
      //   data: user
      // });
    }

  })



})

router.post("/register", async (req, res, next) => {
  const { custUsername, custEmail, custPassword } = req.body;

  let user = await UserModel.findOne({ custEmail });
  //check this
  if (user) {
    return res.redirect('/register');
  }

  const hashedPwd = await bcrypt.hash(custPassword, 12);
  let userData = new UserModel({
    username: custUsername,
    email: custEmail,
    password:hashedPwd
  });

  userData.save((err) => {
    if (err) {
      res.status(400).json({
        message: "The user data was not saved",
        errorMessage: err.message
      })
    } else {
      res.status(201).json({
        message: "User data was saved successfully"
      })
    }
  })


})


router.post("/logout", (req, res, next) => {
  console.log('inside logout :: ', req.body)

})



module.exports = router;
const express = require("express");
const Todo = require("./db/todo.model");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");

// Intialize express app
const app = express();

// Add CORS & bodyParser middleware
app.use(cors());
app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  "mongodb://lucas:42marvin@ds133865.mlab.com:33865/heroku_m1jp2bks",
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.get("/api/v1/todos", (req, res) => {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      console.log(todos);

      res.json(todos);
    }
  });
});

// Get single todo by id
app.get("/api/v1/todos/:id", (req, res) => {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

//post request which adds a todo

app.post("/api/v1/todos", (req, res) => {
  Todo.create(req.body, function(err) {
    if (err) {
      res.status(400).send("adding new todo failed");
    }
  });
  res.status(200).json({ todo: "todo added successfully" });

  //   console.log(req.body)
  //  let todo = new Todo(req.body);
  // console.log(todo);

  //   todo.save()
  //       .then(todo => {
  //       })
  //       .catch(err => {
  //           res.status(400).send('adding new todo failed');
  //       });
});

app.post("/api/v1/todos/:id", (req, res) => {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    // Update for new model
    else todo.description = req.body.description;
    todo.title = req.body.title;
    todo.completed = req.body.completed;

    todo
      .save()
      .then(todo => {
        res.json("Todo updated");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

//deletes a todo
app.delete("/api/v1/todos/:id", (req, res) => {
  const id = req.params.id;

  // Remove by id
  Todo.deleteOne({ _id: id }, function(err) {
    if (err) {
      return res.status(404).send({
        success: "false",
        message: "todo not found"
      });
    }
    return res.status(200).send({
      success: "true",
      message: "todo was removed"
    });
  });
});

// //updating the todo.
// app.put('/api/v1/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   let todoFound;
//   let itemIndex;
//   todos.map((todo, index) => {
//     if (todo.id === id) {
//       todoFound = todo;
//       itemIndex = index;
//     }
//   });

//   if (!todoFound) {
//     return res.status(404).send({
//       success: 'false',
//       message: 'todo not found',
//     });
//   }

//   const updatedTodo = {
//     id: todoFound.id,
//     title: req.body.title ? req.body.title : todoFound.title,
//     description: req.body.description ? req.body.description : todoFound.description,
//   };

//   todos.splice(itemIndex, 1, updatedTodo);

//   return res.status(201).send({
//     success: 'true',
//     message: 'todo added successfully',
//     updatedTodo,
//   });
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

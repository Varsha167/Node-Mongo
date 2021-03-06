
var env = process.env.NODE_ENV || 'development'
console.log('env ***', env)

var db = {
  dev : 'mongodb://localhost:27017/ToDoApp',
  test : 'mongodb://localhost:27017/TodoAppTest',
  mlab : 'mongodb://<dbuser>:<dbpassword>@ds229388.mlab.com:29388/todoapi'
};
if(process.env.PORT){
  process.env.MONGODB_URI = db.mlab;
} else {
  process.env.PORT = 3000;
  if(env === 'development'){
    process.env.MONGODB_URI = db.dev;
  } else if (env === 'test'){
    process.env.MONGODB_URI = db.test;
  }
}


const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser') //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose.js') //destructuring because var mongoose = require('./db/mongoose').mongoose;we are picking out the ".mongoose"
const {Todo} = require('./models/todo.js')
//const Todo = require('./models/todo.js')
//const User = require('./models/users.js')
const {User} = require('./models/users.js')


var app = express()
const port = process.env.PORT

app.use(bodyParser.json()) //middleware

app.post('/todos',(req,res)=>{ //post means sending the data
  console.log("body below")
  console.log(req.body) //we use body parser to see this (from Colt)
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc)=>{
    res.send(doc)
  }).catch((e)=>{
    res.status(400).send(e)
  })
})

app.get('/todos' , (req, res)=> {
  //console.log(req.body)
  Todo.find().then((todos)=>{
    res.send({
       content : todos
    })//todos is actually an array but we put in an object so that if we want we can add on some more code in the object in the future.
  }).catch((e)=>{
    res.status(400).send(e)
  })
  console.log(res.body)
})


app.get('/todos/:id' , (req,res)=>{
  var id = req.params.id
  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
       return res.status(404).send()
    }
    res.send({note:todo})
  }).catch((e)=>{
    res.status(400).send()
  })
})

app.delete('/todos/:id' , (req,res)=>{
  var id = req.params.id //this is where our url parameters are stored. because we have id setup in url, we can get it from here.

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
        return res.status(404).send()
    }
    res.send({todo})

  }).catch((e)=>{
      res.status(400).send()
  })

})

app.patch('/todos/:id' , (req,res)=>{
  var id = req.params.id
  var body = _.pick(req.body , ['text' , 'completed']) //only these are to be updated by the user.Rest will be updated by the system.

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if(body.completed){
  // if( body.completed = true) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    if(!todo){
      res.status(404).send()
    } else {
      res.send({todo:todo})
    }
  }).catch((e)=>{
    res.status(400).send()
  })

})

// app.patch('/todos/:id', (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }
//
//   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });


module.exports = {app}

app.listen(3000,()=>{
  console.log(`Listening on Port ${port}`)
})

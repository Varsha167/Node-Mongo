const express = require('express')
const bodyParser = require('body-parser') //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.


const {mongoose} = require('./db/mongoose.js') //destructuring because var mongoose = require('./db/mongoose').mongoose;we are picking out the ".mongoose"
const {Todo} = require('./models/todo.js')
//const Todo = require('./models/todo.js')
//const User = require('./models/users.js')
const {User} = require('./models/users.js')


var app = express()

app.use(bodyParser.json()) //middleware

app.post('/todos',(req,res)=>{ //post means sending the data
  //console.log(req.body) //we use body parser to see this (from Colt)
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
    res.status(400).send(e)
  })
})

app.listen(3000,()=>{
  console.log("Listening ...")
})

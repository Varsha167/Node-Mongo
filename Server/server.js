const express = require('express')
const bodyParser = require('body-parser') //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose.js') //destructuring because var mongoose = require('./db/mongoose').mongoose;we are picking out the ".mongoose"
const {Todo} = require('./models/todo.js')
//const Todo = require('./models/todo.js')
//const User = require('./models/users.js')
const {User} = require('./models/users.js')


var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json()) //middleware

app.post('/todos',(req,res)=>{ //post means sending the data
  console.log("body below")
  console.log(req.body) //we use body parser to see this (from Colt)
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
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


module.exports = {app}

app.listen(3000,()=>{
  console.log(`Listening on Port ${port}`)
})

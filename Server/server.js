require('./config/config.js')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser') //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose.js') //destructuring because var mongoose = require('./db/mongoose').mongoose;we are picking out the ".mongoose"
const {Todo} = require('./models/todo.js')
//const Todo = require('./models/todo.js')
//const User = require('./models/users.js')
const {User} = require('./models/users.js')
const {authenticate} = require('./middleware/authenticate')


var app = express()
const port = process.env.PORT

app.use(bodyParser.json()) //middleware

app.post('/todos',(req,res)=>{ //post means sending the data
  //console.log("body below")
  //console.log(req.body) //we use body parser to see this (from Colt)
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

app.post('/users' , (req,res)=>{
  //var userbody = _.pick(req.body, ['email' , 'password']) //2 arguments --(req.body) --object that we want to pick from, and 2nd arg is an array of what we want to pick
  //console.log(req.body)
  var newUser = new User ({ //new instance of the User model
    email: req.body.email,
    password: req.body.password
  })
  newUser.save().then(()=>{
    return newUser.generateAuthToken()
    //res.send(user)
  }).then((token)=>{
    res.header('x-auth', token).send(newUser)
  }).catch((e)=>{
    res.status(400).send(e)
  })
})



app.get('/users/me' , authenticate,(req,res)=>{
      res.send (req.user) //removed the code below to make the authenticate middleware
//   var token = req.header('x-auth')
// //user defined function. Because this will be used again and again, we will define it in Models
//   User.findByToken(token).then((user)=>{
//     if(!user) {
// res.status(404).send()
//     } else {
//       res.send(user)
//     }
//   }).catch((e)=<{
//     res.status(401).send()
//   })
})

app.post('/users/login' ,(req,res)=>{
  var body = _.pick(req.body, ['email','password'])

  User.findByCredentials(body.email, body.password).then((user)=>{
  return User.generateAuthToken().then((token)=>{ //for security reasons we create a new token everytime. Can also just use res.send(user)
    res.header('x-auth', token).send(user)
  })
  }).catch((e)=>{
    res.status(400).send()
  })
   //res.send(body)
})

module.exports = {app}

app.listen(3000,()=>{
  console.log(`Listening on Port ${port}`)
})

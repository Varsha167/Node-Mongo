const{ObjectID} = require('mongodb')

const {mongoose} = require('./../Server/db/mongoose')
const{Todo}= require('./../Server/models/todo')
const{User}= require('./../Server/models/users')

//var id = '5a7a8dd0fe011f2b8430718c11'

var id = '5a743e435589e21934e537e7'

User.findById(id).then((user)=>{
  if(!user){
    return console.log("User not found")
  }

  console.log("User :" ,user)
}).catch((e)=>{
  console.log(e)
})


// if(!ObjectID.isValid(id)){
//   console.log("ObjectID is not valid")
// }
// //this gives an array (why?)
// Todo.find({
//   _id : id
// }).then((todos)=>{
//   if(!todos){
//   return  console.log("Error from find")
//   }
//   console.log('Todos', todos)
// })
//
// //This gives an object (Why?)
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   if(!todo){
//     return console.log("Error from findOne")
//   }
//   console.log('Todo' , todo)
// })
//
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log("Id not found")
//   }
//   console.log('Todo by id', todo)
// }).catch((e)=>{
//   console.log(e)
// })

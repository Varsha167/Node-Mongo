//const MongoClient = require('mongodb').MongoClient
const{MongoClient,ObjectID} = require('mongodb') //destructuring

// var user = {
//   name: 'Varsha',
//   age:32
// }
// console.log(user.name)
//destructuring
// var {name}= user
// console.log(name)

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err,db)=>{
  if(err){
    return console.log("Could not connect to the Database")
  }

//return ke baad processing stops. So either use return in if or use else.
   console.log("Connected to the DB server")
//toArray returns a promise. That's why then
   db.collection('TodosPr').find({
     _id: new ObjectID('5a7712e6d1bb38293058c421') //objct ID has to be queired this way.
   })
   .toArray().then((docs)=>{
     console.log('todos')
     console.log(docs)
     console.log(JSON.stringify(docs,undefined,2))
   }, (err)=>{
     console.log("Unable to fetch the Todos list")
   })

//promise
   // db.collection('Todos').find().count().then((count)=>{
   //   console.log('todos: count:',count)
   //   console.log()
   // }, (err)=>{
   //   console.log("Unable to fetch the Todos list")
   // })

   // db.collection('Users').find({name: 'Harry Potter'}).count().then((count)=>{
   //   console.log('Users: count:',count)
   //   console.log()
   // }, (err)=>{
   //   console.log("Unable to fetch the Todos list")
   // })

   db.collection('Users').find({name: 'Harry Potter'}).toArray().then((docs)=>{
     console.log('Users:' )
     console.log(JSON.stringify(docs,undefined,2))
   }, (err)=>{
     console.log("Unable to fetch the Todos list")
   })

//with callback
   // db.collection('Todos').find().count((err,cnt)=>{
   //   if (cnt) {
   //    console.log('todos cnt:' , cnt)
   //   }
   //   else {
   //     console.log("Error")
   //   }
   // })


   //db.close()

})

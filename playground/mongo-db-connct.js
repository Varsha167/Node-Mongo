//const MongoClient = require('mongodb').MongoClient
const{MongoClient} = require('mongodb') //destructuring

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

   // db.collection('Todos').insertOne({
   //   text: "Something else to do",
   //   completed: false
   // },(err,result)=>{
   //   if(err){
   //     return console.log("Unable to add the document", err)
   //   }
   //  // console.log(JSON.stringify(result.ops,undefined,2))
   //  console.log(result.ops)
   // })

   //
   // db.collection('Users').insertOne({
   //  name: "Harry Potter",
   //  age: 30,
   //  Location: "Hogwarts School of Witchcraft and Wizardry"
   // },(err,result)=>{
   //   if(err){
   //     return console.log("Unable to add the document", err)
   //   }
   //   console.log(JSON.stringify(result.ops,undefined,2))
   // })
   db.close()

})

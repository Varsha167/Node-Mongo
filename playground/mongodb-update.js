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

//    db.collection('Todos').findOneAndUpdate({
//      _id: new ObjectID("5a71bd803cae9021584aeb7a")
//    },
//  {
//    $set: {
//    completed: true
//   }
// },{
//   returnOriginal: false
// },(result,err)=>{
//   if(result){
//     return console.log(result)
//   }
//   console.log("error",err)
// })


db.collection('Users').findOneAndUpdate({
  _id: new ObjectID("5a729e4139e566d8a415ee39")
},
{
$inc: {
Age: 1
}
},{
returnOriginal: false
},(result,err)=>{
if(result){
 return console.log(result)
}
console.log("error",err)
})


   //db.close()

})

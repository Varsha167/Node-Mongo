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
//deleteMany
// db.collection('Todos').deleteMany({text:'Be Awesome'}).then((result)=>{
//   console.log(result)
// })

db.collection('Users').deleteMany({name:'Harry Potter'}).then((result)=>{
  console.log(result)
})

// deleteOne
// db.collection('Todos').deleteOne({text:'Be Awesome'}).then((result)=>{
//   console.log(result)
// })


//findOneAndDelete
// db.collection('Todos').findOneAndDelete({text:'Be Awesome'}).then((result)=>{
//   console.log((result));
// })

db.collection('Users').findOneAndDelete({
  _id: new ObjectID("5a729e0039e566d8a415ee25")
}).then((result)=>{
  console.log((result));
})
   //db.close()

})

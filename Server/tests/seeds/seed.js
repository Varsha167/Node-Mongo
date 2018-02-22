const{ObjectID} = require('mongodb')
const{Todo} = require ('./../../models/todo.js')
const{User} = require ('./../../models/users.js')

const jwt = require('jsonwebtoken')

const useroneid = new ObjectID()

const usertwoid = new ObjectID()

const users = [{
  _id : useroneid,
  email: 'HarryPotter@hogwarts.com',
  password: 'useronepass',
  tokens : [{
    access: 'auth',
  token : jwt.sign({_id:useroneid, access : 'auth'} , 'abc123' ).toString()
}]
} , {
  _id : usertwoid,
  email: 'Hermione@hogwarts.com',
  password: 'usertwopass'
}]

const todos = [{
  _id: new ObjectID,
  text: "todo test 1",

}, {
  _id: new ObjectID,
  text: "todo test 2",
  completed: true,
  completedAt: 333
}]


//run this peiece of code before every test case

const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
return Todo.insertMany(todos)
}).then(()=> done())
}

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne =new User(users[0]).save()
    var userTwo =new User(users[1]).save()

    //with the above save , the middleware will work. We need the middleware otherwise our passwords won't get tokenised. After they are saved, we will use the promises from the above stp in the below step.
    return Promise.all([userOne, userTwo])
  }).then(()=>done())
}


module.exports = {
  todos:todos,
  users : users,
  populateTodos : populateTodos,
  populateUsers : populateUsers
}

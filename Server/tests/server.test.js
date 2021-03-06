
const expect = require('expect')
const request = require('supertest')

const{ObjectID} = require('mongodb')
const{app} = require('./../server') //extracting it from module exports
const{Todo} = require('./../models/todo')
const{User} = require('./..//models/users')
const {todos, populateTodos , users, populateUsers} = require('./seeds/seed.js')

beforeEach(populateUsers)
beforeEach(populateTodos)

  // beforeEach((done)=>{
  //   Todo.remove({}).then(()=> done())
  // })

describe('POST /todos' ,()=>{
it('should create a new todo' , (done)=>{
  var text1 = 'test todo app'

  request(app)
  .post('/todos')
  .send({   // can be written as .send({text})
    text:text1
  })
  .expect(200)
  .expect((res)=>{ //custom expect
    expect(res.body.text).toBe(text1)
  })
  .end((err,res)=>{ //check what got stored in mongo db collection
    if(err) {
    return done(err)
  }

Todo.find({
  text : text1
}).then((todos)=>{ //make a request to the database fetching all todos verifying that our one todo is added
  expect (todos.length).toBe(1)
  expect(todos[0].text).toBe(text1)
  console.log(todos)
  done()
}).catch((e)=>done(e)) //why do we need catch here? because otherwise this testcase will pass anyhow. Why? see below
})
})

 it('should not create todo with invalid body' , (done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if(err) {
        return done(err)
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2)
        done()
      }).catch((e)=>{
        done(e)
      })
    })
 })
})

describe('GET Todos',()=>{

it('should get the todo list', (done)=>{
  request(app)
  .get('/todos')
  .expect(200)
  .expect((res)=>{
    //expect(res.body.content.length).toBe(2)
    expect(res.body.content[0].text).toBe(todos[0].text)
  })
  .end(done)
})


})



describe('GET /todos/id' , ()=>{

    it('should get todos according to ID', (done)=>{
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) //this is an object ID and we will have to convert it into a string because that is what we pass as our URL. So hexString
      .expect(200)
      .expect((res)=>{
        //expect(res.body.note._id).toBe(todos[0]._id.toHexString())
        expect(res.body.note.text).toBe(todos[0].text)
      })
      .end(done)
    })


    it('should return a 404 if todo not found' , (done)=>{
      var newId = new ObjectID().toHexString()
      console.log("new id" , newId)
      request(app)
      .get(`/todos/${newId}`)
      .expect(404)
      .end(done)
    })

    it('should return 404 for non-object Ids' ,(done)=>{
      request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
    })
})


describe('Delete Todos' , ()=>{
  it('should remove a todo', (done)=>{
    var hexId = todos[0]._id.toHexString()

    request(app)
     .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err,res)=>{
      if(err){
        return done(err)
      }

      Todo.findByIdAndRemove(hexId).then((todo)=>{
        expect(todo).toNotExist()
        done()
      }).catch((e)=>{
        done(e)
      })
    })
  })

  it('should return 404 if todo not found' ,(done)=>{
var hexId = new ObjectID().toHexString()

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  })

  it('should return 404 for invalid object id ' , (done)=>{
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done)
  })

})

describe('/PATCH /todos/:id' ,()=>{
it('should update the todo' ,(done)=>{
  var id = todos[0]._id.toHexString()
  var text = 'This should be the new text'

  request(app)
  .patch(`/todos/${id}`)
  .send({
    text: text ,
    completed: true
  })

    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text)
      expect(res.body.todo.completed).toBe(true)
      expect(res.body.todo.completedAt).toBeA('number')

    })
.end(done)
})

it(('should clear completedAt when todo is not complete'),(done)=>{
  var id = todos[1]._id.toHexString()
  var text = 'changed text'

  request(app)
  .patch(`/todos/${id}`)

  .send({
    text: text,
    completed: false
  })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text)
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toNotExist()

    })
.end(done)
})
})


describe('get /users/me' ,()=>{
  it('should return user when authenticated' , (done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString())
      expect(res.body.email).toBe(users[0].email)
    })
    .end(done)
  })


  it('should return 401 when authentication fails' ,(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})



describe('POST /users' ,()=>{
  var email = 'example@example.com'
  var password = 'qwerty123'
  it('should create a valid user', (done)=>{
    request(app)
    .post('/users')
    .send({
      email: email,
      password: password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist()
      expect(res.body.email).toBe(email)
      expect(res.body._id).toExist()
    })
.end((err) =>{
  if(err){
    return done(err)
  }

  User.findOne({email : email}).then((user)=>{
    expect(user.password).toNotBe(password)
    expect(user).toExist()
    done()
  })
})
  })

it('should return validation error if request is invalid' , (done)=>{
  var email = 'wert'
  var password = 'we2'
  request(app)
  .post('/users')
  .send({email : email,
  password: password})
  .expect(400)
  .end(done)
})

it('should not create user if email in use' ,(done)=>{
  var email = 'Hermione@hogwarts.com' //already present in db.
  var password = 'something'

  request(app)
  .post('/users')
  .send({email : email, //users[0].email
  password : password})
  .expect(400)
  .end(done)
})


})

//
//
//
//
//
//
//
//
// // //This is because the promise is going to swallow up the error, preventing mocha from ever realizing that expect threw an error. The promise will pass error handling onto the next error handler, which happens to be our catch call. We can then take the error (e argument) and pass it into the done function.

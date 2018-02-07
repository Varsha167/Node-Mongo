const expect = require('expect')
const request = require('supertest')

const{app} = require('./../server') //extracting it from module exports
const{Todo} = require('./../models/todo')

//run this peiece of code before every test case
const todos = [{
  text: "todo test 1"
}, {
  text: "todo test 2"
}]

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
return Todo.insertMany(todos)
}).then(()=> done())
})

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
    expect(res.body.content.length).toBe(2)
  })
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


// const expect = require('expect');
// const request = require('supertest');
//
// const {app} = require('./../server');
// const {Todo} = require('./../models/todo');
//
// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// });
//
// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {
//     var text = 'Test todo text';
//
//     request(app)
//       .post('/todos')
//       .send({text})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
//
//   it('should not create todo with invalid body data', (done) => {
//     request(app)
//       .post('/todos')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(0);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

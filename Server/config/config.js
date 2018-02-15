var env = process.env.NODE_ENV || 'development'
console.log('env ***', env)

var db = {
  dev : 'mongodb://localhost:27017/ToDoApp',
  test : 'mongodb://localhost:27017/TodoAppTest',
  mlab : 'mongodb://varsha_todo:varsha_todo@ds229388.mlab.com:29388/todoapi'
};

if(process.env.PORT){
  process.env.MONGODB_URI = db.mlab;
} else {
  process.env.PORT = 3000;
  if(env === 'development'){
    process.env.MONGODB_URI = db.dev;
  } else if (env === 'test'){
    process.env.MONGODB_URI = db.test;
  }
}

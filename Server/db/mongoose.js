const mongoose = require('mongoose')

const LOCAL_MONGO = 'mongodb://localhost:27017/ToDoApp'
const mLAB_MONGO = 'mongodb://varsha_todo:varsha_todo@ds229388.mlab.com:29388/todoapi'

mongoose.Promise = global.Promise

mongoose.connect(process.env.PORT? mLAB_MONGO : LOCAL_MONGO)

module.exports = {
  mongoose: mongoose
}

const mongoose = require('mongoose')
const validator = require ('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

//This is what we need to tack on custom methods. Can't do that with only the models
var UserSchema = new mongoose.Schema({
  name:{
    type: String
  },

  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, //so user cannot make 2 accounts with same email id
    validate: {
      //validator: validator.isEmail,
      validator: (value)=>{
        return validator.isEmail(value) //can also be written as validator.isEmail (return true or false )
      },
      message: '{VALUE} is not a valid email.'
    }
  },
    password : {
      type: String,
      required: true,
      minlength: 6
    },
    tokens :[{ //this is always an array of objects
      access: {
        type: String,
        required: true
      },
     token :{
      type: String,
      required: true
    }
  }]
})

//Overidding generateAuthToken method
UserSchema.methods.toJSON = function() { //this is an instance method. Instance methods get called with individual documents.
  var user = this
  var userObject = user.toObject()

return _.pick(userObject , ['_id' , 'email'])
}

//using ES5 system of writing function because we need to bind "this"
UserSchema.methods.generateAuthToken = function() {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id:user._id, access: access}, 'abc123').toString()

  //now push the access and token variables to the tokens array up above

  user.tokens = user.tokens.concat([{
    access: access,
    token: token
  }])


  return user.save().then(()=>{ // we are rturning this whole thing because this  will be used over in server.js
    return token //the variabe above
  })

  ///////////////////////////
//The above piece of code is basically this:
// user.save().then(()=>{
//   return token
// }).then((token)=>{ //the token value will be passed as a success argument for the next then call.
//
// }) //this second part will hapen in server js thats why we are returning the whole thing and also in server.js we are writing it as return newUser.generateAuthToken()
  //////////////////////////
}

UserSchema.statics.findByToken = function (token)  {
  var User = this
  var decoded

  try{
  decoded = jwt.verify(token , 'abc123')
} catch (e) {
    return new Promise((resolve,reject)=>{
      reject()
    } )
  }

  return User.findOne({
    _id : decoded._id,
    'tokens.token' : token, //parameter wala token
    'tokens.access' : 'auth'
  })
}


UserSchema.statics.findByCredentials = function(email,password) {
  var User = this;

  return User.findOne({email}).then((user)=> {
    if(!user) {
      return new Promise((resolve, reject)=> {
        reject();
      })
}
      return new Promise((resolve,reject)=> {
        bcrypt.compare(password, user.password, (err,res)=> {
          if(res){
            resolve(user);
          }
          else {
            reject();
          }
        })
      })
  })
}


UserSchema.pre('save' , function(next){ //Always do this before saving anything
  var user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err,salt)=>{
      bcrypt.hash (user.password, salt, (err, hash)=>{
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

var User = mongoose.model('User',UserSchema)


module.exports = {
  User: User
}

const {SHA256} = require('crypto-js')
const jwt =require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var password = 'abc123!'

 bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt, (err, hash)=>{
    console.log(hash)
  })
})


var hashedPassword = '$2a$10$tkE6aNgt17QTKDssl00jbeWv.p2xninJ4f.feQuMdAvbqVr46RZ6i'

bcrypt.compare('password', hashedPassword,(err,res)=>{
  console.log(res)
} )


//bcrypt.compare
// var data = {
//   id: 4
// }
//
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 7
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash){
//   console.log("All Good")
// } else console.log ("security breach")

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data , '123abc')
// console.log(token)
//
// var decoded = jwt.verify(token,'123abc')
// console.log(decoded)

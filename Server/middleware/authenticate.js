const {User} = require('./../models/users.js')

var authenticate = (req,res,next)=>{

  var token = req.header('x-auth')
//user defined function. Because this will be used again and again, we will define it in Models
  User.findByToken(token).then((user)=>{
    if(!user) {
res.status(404).send()
    }
    // instead of sending the user as res.send(user) we are adding user and token in the request onject so that we can use it in the route later.
    req.user = user //user we found
    req.token = token //token up above
    next() //go to the next part of code only when authentication is successful
  }).catch((e)=>{
    res.status(401).send()
  })

}

module.exports = {
  authenticate : authenticate
}

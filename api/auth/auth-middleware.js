const User = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
// !This code works, do not touch
const restricted = (req,res,next) => {
  if(req.session && req.session.user){
    next()
  }else{
    res.status(401).json({message: 'You shall not pass!'})
  }
}


/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
// !This code works
const checkUsernameFree = async (req,res,next) => {
  try{
    const rows = await User.findBy({username: req.body.username})
     if(!rows.length) {
       next()
     }else{
       res.status(422).json({message: 'Username taken'})
     }
  }catch(e){
    res.status(500).json(`Server error: ${e}`)
  }

}
/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/

const checkUsernameExists = async (req,res,next) => {
  const { username } = req.body;
  try {
    const user = await User.findBy({username}).first()
    if(user && user.username) {
      req.verifiedUser = user;
      next()
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (err) { next(err) }
  
  // try{
  //   const user = await User.findBy({username: req.body.username})
  //   if(user.length) {
  //     res.userData = user[0]
  //     next()
  //   }else{
  //     res.status(401).json({message: 'Invalid credentials'})
  //   }
  // }catch(e){
  //   next(e)
  // }

}
/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = (req,res,next) => {
  const password = req.body.password;
  if(!password || password.length <= 3){
    res.status(422).json({message: 'Password must be longer than 3 chars'})
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../users/users-model')
const {checkUsernameFree,  checkUsernameExists, checkPasswordLength,} = require('./auth-middleware');

// !This works, do not touch
router.post('/register', checkUsernameFree, checkPasswordLength, async (req,res, next) => {
  try{
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 10) // 2^10 power 
    const newUser = await User.add({username, password: hash})
    res.status(201).json(newUser)
  }catch(e){
    next(e)
  }
})


router.post('/login', checkUsernameExists, async (req,res,next) => {
  
    const { password } = req.body;
    if(req.verifiedUser && bcrypt.compareSync(password, req.verifiedUser.password)) { 
        req.session.user = req.verifiedUser; // save session/set cookie on client
        res.json({message: `Welcome ${req.verifiedUser.username}`});
    } else { 
        res.status(401).json({message: 'Invalid credentials'})
    }
    next();

})


  router.get('/logout', (req, res, next) => {
    if(req.session && req.session.user) {
      req.session.destroy(err => {
        if (err) {
          res.json({message:'you cannot leave'})
        } else {
          res.json({message:'logged out'})
        }
      })
    } else {
      res.json({message:'no session'})
    }
  })

// if(req.session && req.session.User) {
//   req.session.destroy(err => {
//     if(err) {
//       res.json({message: "no session"})
//     } else {
//       res.json({message: "logged out"})
//     }
//   })
// }else res.json({message: 'no session'})
// })

// router.post('/logout', (req,res,next) => {
//   try{
//     if(!req.session && !req.session.User) {
//       res.status.json({message: 'no session'})
//     }else{
//       req.session.destroy(err => {
//         if(err){
//           next(err)
//         }else{
//           res.json({message: "logged out"})
//         }
//       })
//     }
//   }catch(e) {
//     next(e)
//   }
// })


module.exports = router 

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

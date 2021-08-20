const Auth = require('./auth-model')

const validateUniqueUser = async(req, res, next) => {
    try {
        const {username} = req.body
        const existingUser = await Auth.findByUsername(username)

        if(existingUser) {
        next({message:'username taken'})
        }
        else {
        next()
    }}
    catch(err) {
    next(err)
  }
}

const checkBody = (req, res, next) => {
    const { username, password } = req.body
    const valid = Boolean(username && password)

    if (valid) {
        next()
    } else {
        next({
        status: 422,
        message: 'username and password required'
        })
    }
  }

const checkUsernameExists = async (req, res, next) => {
    try{
        const user = await Auth.findByUsername(req.body.username)
        if(!user){
            next({status:401, message:"invalid credentials"})
        }
        else {
            req.user = user
            next()
        }
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    validateUniqueUser,
    checkBody,
    checkUsernameExists
} 
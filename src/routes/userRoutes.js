import { Router } from 'express'
import { 
    registerUser, 
    loginUser,
    confirmUser
 } from '../controllers/userController'

const userRouter = Router()

userRouter.post('/', registerUser)
userRouter.get("/confirmed/:token",confirmUser);
userRouter.post('/login', loginUser)

module.exports = userRouter

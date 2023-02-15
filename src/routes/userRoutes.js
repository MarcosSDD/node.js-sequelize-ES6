import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/userController'

const userRouter = Router()

userRouter.get('/', registerUser)
userRouter.get('/login', loginUser)

module.exports = userRouter

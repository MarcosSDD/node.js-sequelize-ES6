import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/userController'

const userRouter = Router()

userRouter.post('/', registerUser)
userRouter.post('/login', loginUser)

module.exports = userRouter

import { Router } from 'express'
import {
	registerUser,
	loginUser,
	confirmUser,
	forgetPassword,
	checkTokenForPassword,
} from '../controllers/userController'

const userRouter = Router()

userRouter.post('/', registerUser)
userRouter.get('/confirmed/:token', confirmUser)
userRouter.post('/login', loginUser)
userRouter.post('/forget-password', forgetPassword)
userRouter.get('/forget-password/:token', checkTokenForPassword)

module.exports = userRouter

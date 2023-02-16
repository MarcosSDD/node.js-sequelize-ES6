import { Router } from 'express'
import {
	registerUser,
	loginUser,
	confirmUser,
	forgetPassword,
	checkTokenForPassword,
	newPassword,
} from '../controllers/userController'

const userRouter = Router()

userRouter.post('/', registerUser)
userRouter.get('/confirmed/:token', confirmUser)
userRouter.post('/login', loginUser)
userRouter.post('/forget-password', forgetPassword)
userRouter.get('/forget-password/:token', checkTokenForPassword)
userRouter.post('/forget-password/:token', newPassword)

module.exports = userRouter

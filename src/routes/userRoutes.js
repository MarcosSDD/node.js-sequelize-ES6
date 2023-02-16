import { Router } from 'express'
import {
	registerUser,
	loginUser,
	confirmUser,
	forgetPassword,
	checkTokenForPassword,
	newPassword,
	profileUser,
	updateUser,
	updatePassword
} from '../controllers/userController'

const userRouter = Router()

//Public Area
userRouter.post('/', registerUser)
userRouter.get('/confirmed/:token', confirmUser)
userRouter.post('/login', loginUser)
userRouter.post('/forget-password', forgetPassword)
userRouter.get('/forget-password/:token', checkTokenForPassword)
userRouter.post('/forget-password/:token', newPassword)

//Private Area
userRouter.get('/:id', checkAuth, profileUser)
userRouter.put('/:id', checkAuth, updateUser)
userRouter.patch('/update-password', checkAuth, updatePassword)

module.exports = userRouter

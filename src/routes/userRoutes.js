import { Router } from 'express'

import checkAuth from '../middleware/authMiddleware.js'
import { userController }  from '../controllers/'
import { validUser }  from '../validations/'

const userRouter = Router()

//Public Area
userRouter.post('/', validUser, userController.registerUser)
userRouter.get('/confirmed/:token', userController.confirmUser)
userRouter.post('/login', userController.loginUser)
userRouter.post('/forget-password', userController.forgetPassword)
userRouter.get('/forget-password/:token', userController.checkTokenForPassword)
userRouter.post('/forget-password/:token', userController.newPassword)

//Private Area
userRouter.get('/:id', checkAuth, userController.profileUser)
userRouter.put('/:id', checkAuth, userController.updateUser)
userRouter.patch('/update-password', checkAuth, userController.updatePassword)

export default  userRouter 

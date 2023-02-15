import express from 'express'
import  userRouter from './routes/userRoutes.js'

const app = express()

app.use('/user', userRouter)

module.exports = app

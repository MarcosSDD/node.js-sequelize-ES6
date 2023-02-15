import express from 'express'
import userRouter from './routes/userRoutes.js'

const app = express()

//body parser json
app.use(express.json())

app.use('/api/user', userRouter)

module.exports = app

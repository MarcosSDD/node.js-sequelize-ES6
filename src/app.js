import express from 'express'
import userRouter from './routes/userRoutes.js'
import logger from '../logger/'
import cors from 'cors'

const app = express()

//body parser json
app.use(express.json())

const allowedDomains = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function (origin, callback) {
    if(!origin){  //for bypassing postman req with  no origin
      return callback(null, true);
    }
    if (allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/user', userRouter)

module.exports ={ app, logger }    

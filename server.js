require('@babel/register')
/* eslint-disable no-console */
const dotenv = require('dotenv').config()
const app = require('./src/app')

const portServer = process.env.APP_PORT || 3000

const server = app.listen(portServer, () => {
  console.log(`Server working in port ${portServer}`)
})

module.exports = server

require('@babel/register');
/* eslint-disable no-console */
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: '.env' });

const portServer = process.env.APP_PORT || 3000;

const server = app.listen(portServer, () => {
    console.log(`Server working in port ${portServer}`)
})
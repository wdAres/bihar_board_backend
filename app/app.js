const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');
const authRouter = require('./routes/authRoute')
const contactRouter = require('./routes/contactRoute')
const studentRouter = require('./routes/studentRoute')
const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// path join nahi kiya ? hum krte hai fir dikhate hai rukiye

app.use(cors())
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/center',centerRouter)
app.use('/api/v1/',contactRouter)
app.use('/api/v1/',studentRouter)

// db checking
sequelize.sync().then(() => { console.log('Database & tables created!'); });

// Universal Error Catcher
app.use(ErrorController.showError)

module.exports = app 
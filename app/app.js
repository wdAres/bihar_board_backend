const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');
const authRouter = require('./routes/authRoute')
const contactRouter = require('./routes/contactRoute')
const centerRouter = require('./routes/centerRoute')
const studentRouter = require('./routes/studentRoute')
const noticeRouter = require('./routes/noticeRoute')
const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// path join nahi kiya ? hum krte hai fir dikhate hai rukiye


app.use(cors({
    origin: '*', // Allows all origins 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Adjust if credentials are needed
}));

app.options('*', cors());

// app.use(cors())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/center', centerRouter)
app.use('/api/v1/', contactRouter)
app.use('/api/v1/', studentRouter)
app.use('/api/v1/', noticeRouter)

// db checking
sequelize.sync().then(() => { console.log('Database & tables created!'); });

// Universal Error Catcher
app.use(ErrorController.showError)

module.exports = app 
const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');
const authRouter = require('./routes/authRoute')
const contactRouter = require('./routes/contactRoute')
const centerRouter = require('./routes/centerRoute')
const studentRouter = require('./routes/studentRoute')
const noticeRouter=require('./routes/noticeRoute')
const adminRoutes = require('./routes/adminRoute');
// const noticeRouter = require('./routes/noticeRoute')
const supportRoutes = require('./routes/supportRoute');

const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// app.use(cors({
//     origin: '*', // Allows all origins 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true // Adjust if credentials are needed
// }));

// app.options('*', cors()); // Handle preflight requests for all routes


app.use(cors())
app.use('/api/v1/supports', supportRoutes);
app.use('/api/v1/admin',adminRoutes)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/center',centerRouter)
app.use('/api/v1/',contactRouter)
app.use('/api/v1/',studentRouter)
app.use('/api/v1/',noticeRouter)

sequelize.sync().then(() => { console.log('Database & tables created!'); });

app.use(ErrorController.showError)

module.exports = app 
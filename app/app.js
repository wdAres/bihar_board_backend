const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');

const adminRouter = require('./routes/_adminRoutes');
// const authRouter = require('./routes/authRoute')
// const centerRouter = require('./routes/centerRoute')
// const studentRouter = require('./routes/studentRoute')
// const supportRoutes = require('./routes/supportRoute');
// const filterData = require('./routes/filterRoute');
// const tenderRoutes = require('./routes/tenderRoute');
// const noticeRouter=require('./routes/noticeRoute')

const path= require('path')
// const contactRouter = require('./routes/contactRoute')
// // const noticeRouter = require('./routes/noticeRoute')


const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use(cors({
//     origin: '*', // Allows all origins 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true // Adjust if credentials are needed
// }));

// app.options('*', cors()); // Handle preflight requests for all routes


app.use(cors())
app.use('/api/v1/admin',adminRouter)
// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/center',centerRouter)
// app.use('/api/v1/',studentRouter)
// // app.use('/api/v1/',contactRouter)
// app.use('/api/v1/supports', supportRoutes);
// app.use('/api/v1/',noticeRouter)
// app.use('/api/v1', filterData);
// app.use('/api/v1', tenderRoutes);   
sequelize.sync().then(() => { console.log('Database & tables created!'); });

app.use(ErrorController.showError)

module.exports = app 
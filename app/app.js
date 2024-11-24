const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');

const adminRouter = require('./routes/_adminRoutes')
const centerRouter = require('./routes/_centerRoutes')
const websiteRouter = require('./routes/_websiteRoutes')

const path= require('path')

const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors())
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/school',centerRouter)
app.use('/api/v1/website',websiteRouter)


sequelize.sync().then(() => { console.log('Database & tables created!'); });

app.use(ErrorController.showError)

module.exports = app 
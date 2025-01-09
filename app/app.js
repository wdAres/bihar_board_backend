const express = require('express');
const app = express();
const sequelize = require('./connection/db')
const ErrorController = require('./controllers/errorController');
const adminRouter = require('./routes/_adminRoutes')
const centerRouter = require('./routes/_centerRoutes')
const websiteRouter = require('./routes/_websiteRoutes')
const csvUploadRouter = require('./routes/predataRouter');
const admitCardRouter = require('./routes/predataRouter');
const path = require('path')

const cors = require('cors')
// TO PARSE JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'admit_cards')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors())

app.get('/admit-card',(req,res,next)=>{
    const studentData = { student_name: "Puneet Shrivastav", student_father_name: "Puneet Shrivastav", student_mother_name: "Puneet Shrivastav", dob_in_figures: "13/08/2002", dob_in_words: "Thirteen August Two Thousand Two", student_cast: "Regular", student_category: "General", student_sex: "male", student_aadhar_no: "123412341234", school_name: "Kendriya Vidhayala Centeral School", student_required_subject: "Sanskrit", student_additional_subject: "Maithili" };
    res.render('admit_card',studentData)
})

app.get('/api/admit-card',(req,res,next)=>{
    res.render('admit_card_2.ejs' , {
        student_name: 'Puneet Shrivastav',
            student_father_name: 'Rajender Shrivastav',
            student_mother_name: 'Poonam Shrivastav',
            dob_in_figures: '13/08/2002',
            dob_in_words:'thirteen august two thousan two' ,
            student_cast: 'general',
            student_category: 'regular',
            student_sex: 'male',
            student_aadhar_no: '123412341234',
            school_name: 'Sarvodhya Co-Ed School',
            student_required_subject: 'sanskrit',
            student_additional_subject: 'maths',
            student_signature: 'http://127.0.0.1:8001/uploads/1733401340212-th (1).jpeg',
            student_photo: 'http://127.0.0.1:8001/uploads/1733393106185-em.jpg',
    })
})
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/school', centerRouter)
app.use('/api/v1/website', websiteRouter)
app.use('/api/v1/upload', csvUploadRouter);
app.use('/api/v1/admit-card', admitCardRouter);
sequelize.sync().then(() => { console.log('Database & tables created!'); });

app.use(ErrorController.showError)

module.exports = app 
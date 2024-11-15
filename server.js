require('dotenv').config({ path: '.env' });
const app = require('./app/app');


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`port is running on : http://127.0.0.1:${port}`)
})
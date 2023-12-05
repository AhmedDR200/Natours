const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Dotenv Config
dotenv.config({path: './config.env'});
const app = require('./app');

// MongoDB Connection
const DB = process.env.DATABASE
.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Successful!'));



const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server is running in ${process.env.NODE_ENV} on http://localhost:${port}`);
});
const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Express App
const app = express();


// Json Middleware
app.use(express.json());


// Morgan Middleware (Logging)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};


// Static Files Middleware
app.use(express.static(`${__dirname}/public`));


// Routes
app.use('/api/users', usersRouter);
app.use('/api/tours', toursRouter);


// 404 Error Middleware
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // });
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// 500 Error Middleware
app.use(globalErrorHandler);

// Export App
module.exports = app;
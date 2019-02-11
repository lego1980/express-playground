const express = require('express');
const app = express();

// log process in the terminal
const morgan = require('morgan');
app.use(morgan('dev'));

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//MongoDB and Mongoose
const mongoose = require('mongoose');
const mongodbUrl = "mongodb://"+process.env.mongodb_user+":"+process.env.mongodb_pw+"@192.168.0.40/"+process.env.mongodb_db;
mongoose.connect(
    mongodbUrl, 
    { useNewUrlParser : true }
);

// headers - cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



// routes which should handle requests
const usersRoutes = require('./api/routes/users');
const commentsRoutes = require('./api/routes/comments');
app.use('/users', usersRoutes); 
app.use('/comments', commentsRoutes);

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
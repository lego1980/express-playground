const apiVersion = "/api/1.0";
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configure bodyparser to handle post requests
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

const MongoDatabase = "testDb";
const MongoUser = "lego1980";
const MongoDbPassword = "1980Dbz4";
const MongodbUrl = "mongodb://"+MongoUser+":"+MongoDbPassword+"@192.168.0.40/"+MongoDatabase;

//Mongoose
const Mongoose = require('mongoose');
Mongoose.connect(MongodbUrl);
const Db = Mongoose.connection;

const Schema = Mongoose.Schema;

const UsersSchema = new Schema({
    _id : Schema.Types.ObjectId,
    username : String,
    password : String
});

Db.on('error', 
    console.error.bind(
        console, 'Connection error:'
    )
);

Db.on('open', () => {
        app.listen(port, () => {
            console.log('listening on port')
        });
    }
);

app.get(apiVersion+'/users', (req, res) => {
    Db.collection('users').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.json({results: result})
    });
});

app.get(apiVersion+'/users/:id', (req, res) => {
    Db.collection('users').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.json({results: result})
    });
});

app.post(apiVersion+'/users', (req, res) => {
    Db.collection('users').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.json({results: result})
    });
});
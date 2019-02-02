//https://zellwk.com/blog/crud-express-mongodb/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

/*
app.listen(3000, function() {
    console.log('listening on 3000')
});
*/
/*
app.get('/', (req, res) => {
    res.send('Hello World')
})
*/ 

var db;
const MongoUser = "lego1980";
const MongoDbPassword = "test123";
const MongodbUrl = "mongodb://"+MongoUser+":"+MongoDbPassword+"@ds129823.mlab.com:29823/mlabdev";
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(MongodbUrl, (err, client) => {
  if (err) return console.log(err)
  db = client.db('mlabdev') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000')
  });
});


app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        res.render('index.ejs', {quotes: result})
    });
    
    //res.sendFile(__dirname + '/index.html');
    // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    });
});
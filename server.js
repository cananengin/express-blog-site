require('dotenv/config');
const express           = require('express');
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const app               = express();
const expressLayouts    = require('express-ejs-layouts');
const path              = require('path');
const session           = require('express-session');
const cookieParser      = require('cookie-parser');
const flash             = require('connect-flash');
const expressValidator  = require('express-validator');

// connect-flash: this package helps store flash data on our session

// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false, //forces the session to be saved back to the store
    saveUninitialized: false // dont save unmodified sessions
}));

app.use(flash());

app.use(express.static(__dirname + '/public'));

//app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(require('./app/routes'));

try {
    mongoose.connect( 
        process.env.DB_CONNECTION, // our connection link in .env file. In this way we can use the link
        { useNewUrlParser: true },
        console.log('Connected to DB')
    )
}
catch(err) {
    console.log(err);
}

app.listen(8080, console.log('App listening on 8080'));
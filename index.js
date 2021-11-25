
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongose');
//user for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const JWTStrategy = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);
//sass
const sassMiddleware = require('node-sass-middleware');
//flash message
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('assets'));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));


app.use(expressLayouts);


//extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router

//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in db

//middleware for session cookie and enctypt it
app.use(session({
    name: 'codeial',
    secret: 'blahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
        function (err) {
            console.log(err || 'Connect-mongo setup ok');
        }
    )
}));

app.use(passport.initialize());

app.use(passport.session());

//set current user usage
app.use(passport.setAuthenticatedUser);

//using flash
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));
app.use('/', require('./routes/index'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port :${port}`);
});
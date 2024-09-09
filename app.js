const express = require('express');
const app = express();
require('dotenv').config();
require('')
const expressSession = require('express-session');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');




app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended:true}));
app.use(express.json());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.get('/', (req, res) => {
 res.send('this file are working');
})


app.listen(3000, () => console.log(`server are listening http://localhost:3000/`));
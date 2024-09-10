const express = require('express');
const app = express();
require('dotenv').config();
require('./config/googleOauthConfig');
const db = require('./config/mongooseConnect');
const authRouter = require('./router/auth');
const indexRouter = require('./router/index');
const userRouter = require('./router/user');
const {userModel} = require('./models/userModel');
const expressSession = require('express-session');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const emailConsumer = require('./kafka/emailConsumer');
emailConsumer.run().catch(console.error);
const { generatedError } = require("./middleware/error");
const logger = require("morgan");
const flash = require('connect-flash');





app.set('view engine', 'ejs');
app.use(logger("short"));  
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended:true}));
app.use(express.json());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(generatedError);



app.use('/', indexRouter)
app.use("/auth", authRouter);
app.use('/user', userRouter);


app.listen(3000, () => console.log(`server are listening http://localhost:3000/`));
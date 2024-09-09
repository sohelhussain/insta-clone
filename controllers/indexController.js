const { validate } = require('uuid');
const {userModel,validateUser} = require('../models/userModel');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));




module.exports.registerPageController = (req, res) => {
    res.render('index',{footer:false});
    // res.send('index')
}
module.exports.loginPageController = (req, res) => {
    res.render('login',{footer:false});
    // res.send('index')
}

module.exports.logoutController = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
             return next(err); 
        }
        req.session.destroy((err) => {
            if(err) return next(err);
            res.clearCookie('connect.sid')
            res.redirect('/users/login');
        });
      });
}

module.exports.registerController = async (req, res) => {
    try {
        const { username, email, name, password } = req.body;

        // Validate required fields
        if (!email || !name || !password) {
            return res.status(400).send('Email, Name, and Password are required.');
        }

        // Check if a user with the given email already exists
        let existingUser = await userModel.findOne({ email: email });
        if (existingUser) return res.redirect('/login');

        // Generate a username if not provided
        const generatedUsername = username || email.split('@')[0] || `user_${Date.now()}`;

        // Validate the input data
        const { error } = validateUser({
            username: generatedUsername,
            name,
            email,
            password
        });
        if (error) return res.status(400).send(error.message);

        // Create a new user instance
        let newUser = new userModel({
            username: generatedUsername,
            name,
            email
        });

        // Register the user using passport-local-mongoose
        userModel.register(newUser, password, (err, registeredUser) => {
            if (err) {
                console.error('Registration error:', err.message); // Log the error for debugging
                return res.status(500).send('Error during registration.');
            }

            // Authenticate the user after registration
            passport.authenticate('local')(req, res, () => {
                res.redirect('/feed');
            });
        });
    } catch (error) {
        console.error('Controller error:', error.message); // Log the error for debugging
        res.status(500).send('An unexpected error occurred.');
    }
};




module.exports.feedController = (req, res) => {
    const stories = [];
    const user = {picture:'asdf'};
    const posts = [];
    res.render('feed',{footer:false});
    // res.send('index')
}
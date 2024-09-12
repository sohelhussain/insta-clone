const express = require('express');
const router = express.Router();
const {userModel} = require('../models/userModel');
const {registerPageController, loginPageController, feedController, logoutController, registerController, forgotPassword, resetPassword, forgotPasswordController, resetPasswordPageController} = require('../controllers/indexController')
const passport = require('passport')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', registerPageController);
router.get('/login', loginPageController);
router.get('/logout', logoutController)
router.get('/forgot-password', forgotPasswordController);
router.get('/reset-password/:token', resetPasswordPageController);













router.post('/register', registerController);
router.post("/login", passport.authenticate("local", {
    successRedirect: "/user/feed",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

module.exports = router;
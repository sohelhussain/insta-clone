const express = require('express');
const router = express.Router();
const {userModel} = require('../models/userModel');
const {registerPageController, loginPageController, feedController, logoutController, registerController} = require('../controllers/indexController')
const {userIsLoggedIn} = require('../middleware/loggedIn')
const passport = require('passport')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', registerPageController);
router.get('/login', loginPageController);
router.get('/logout', logoutController)
router.get('/feed', userIsLoggedIn,feedController);

router.post('/register', registerController);
router.post("/login", passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);


module.exports = router;
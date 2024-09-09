const express = require('express');
const router = express.Router();
const {registerPageController, loginPageController, feedController, logoutController} = require('../controllers/indexController')
const {userIsLoggedIn} = require('../middleware/loggedIn')


router.get('/', registerPageController);
router.get('/login', loginPageController);
router.get('/logout', logoutController)
router.get('/feed', userIsLoggedIn,feedController);



module.exports = router;
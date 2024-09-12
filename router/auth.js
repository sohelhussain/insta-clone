const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}),(req, res) => {})

router.get('/google/callback', passport.authenticate('google',{
    successRedirect: '/feed',
    failureRedirect: '/'
}),
(req, res) => {}
);

router.get('/logout',(req, res, next) => {
    req.logout(err=>{
        if (err) { return next(err); }
        res.redirect('/');
    });
})

module.exports = router;
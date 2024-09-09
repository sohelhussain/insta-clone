




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



module.exports.feedController = (req, res) => {
    const stories = [];
    const user = {picture:'asdf'};
    const posts = [];
    res.render('feed',{footer:false});
    // res.send('index')
}
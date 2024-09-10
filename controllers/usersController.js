const {tryError} = require('../middleware/tryError');
const ErrorHandler = require('../utils/ErrorHandler');
const {userModel} = require('../models/userModel');
const {postModel} = require('../models/postModel');
const streamUpload = require('../utils/streamUpload');
const redisClient = require('../config/redisClient');



module.exports.feedPageController = tryError(async (req, res) => {
    const stories = [];
    const user = { picture: "asdf" };
    const posts = [];
    res.render("feed", { footer: true });
    // res.send('index')
  });




//! pages

module.exports.profilePageController = tryError(async (req, res) => {
    const user = await userModel.findOne({_id: req.session.passport.user});
    res.render('profile', { footer: true, user })
});
module.exports.userProfilePageController = tryError((req, res) => {
    res.render('userProfile', { footer: true })
});
module.exports.editPageController = tryError(async (req, res) => {
    const user = await userModel.findOneAndUpdate({_id: req.session.passport.user},{username: req.body.username, name: req.body.name, bio: req.body.bio}, {new: true}); 
    const success = req.flash('success');
    res.render('edit', { footer: true, user, success })
});
module.exports.uploadPageController = tryError((req, res) => {
    res.render('upload', { footer: true })
});
module.exports.searchPageController = tryError((req, res) => {
    res.render('search', { footer: true })
});









module.exports.uploadController = tryError(async (req, res)=>{
    const user = await userModel.findOne({_id: req.session.passport.user}); 
    if(!user) return Next(new ErrorHandler('User not found', 404));


    if(req.file){
    const cachedUpload = await redisClient.get(req.file.originalname);
    let imageUrl;
    if(cachedUpload){
        imageUrl = cachedUpload;
    }else{
        const result = await streamUpload(req)
        imageUrl = result.secure_url;
        await redisClient.set(req.file.originalname,imageUrl);
    }
    console.log(imageUrl);
    user.picture = imageUrl;
    await user.save();
    req.flash('success','profile image updated');
    res.redirect('/user/edit');
}else{
    res.redirect('/user/edit');
}
})


module.exports.updateController = tryError(async (req, res) => {
    const user = await userModel.findOneAndUpdate({_id: req.session.passport.user},{username: req.body.username, name: req.body.name, bio: req.body.bio},{new: true});
    if(!user) return Next(new ErrorHandler('user not found', 404));
    req.flash('success','profile updated');
    res.redirect('/user/edit');
})

module.exports.postController = tryError(async (req, res) => {
    
    const user = await userModel.findOne({_id: req.session.passport.user});
    if(!user) return Next(new ErrorHandler('user not found', 404));

    await postModel.create({
        picture
    })
});

const {tryError} = require('../middleware/tryError');
const ErrorHandler = require('../utils/ErrorHandler');
const {userModel} = require('../models/userModel');
const {postModel, validatePost} = require('../models/postModel');
const {storyModel, validateStory} = require('../models/storyModel');
const streamUpload = require('../utils/streamUpload');
const redisClient = require('../config/redisClient');






//! pages
module.exports.feedPageController = tryError(async (req, res) => {
    const stories = [];
    const user = await userModel.findOne({_id: req.session.passport.user});
    const posts = await postModel.find().populate('user');
    const success = req.flash('success');
    res.render("feed", { footer: true , success,posts, user, stories });
    // res.send('index')
  });

module.exports.profilePageController = tryError(async (req, res) => {
    const user = await userModel.findOne({_id: req.session.passport.user});
    res.render('profile', { footer: true, user })
});
module.exports.userProfilePageController = tryError((req, res) => {
    const error = req.flash('error');
    res.render('userProfile', { footer: true , error})
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
    if(!user) return next(new ErrorHandler('User not found', 404));


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
    if(!user) return next(new ErrorHandler('user not found', 404));
    req.flash('success','profile updated');
    res.redirect('/user/edit');
})

module.exports.updateController = tryError(async (req, res, next) => {
    const user = await userModel.findOneAndUpdate(
        { _id: req.session.passport.user },
        { username: req.body.username, name: req.body.name, bio: req.body.bio },
        { new: true }
    );

    if (!user) return next(new ErrorHandler('User not found', 404)); // Use next correctly

    req.flash('success', 'Profile updated');
    res.redirect('/user/edit');
});

module.exports.postController = tryError(async (req, res, next) => {
    let { category, caption } = req.body;

    if (!req.file) {
        req.flash('error', 'Image is required');
        return next(new ErrorHandler('Image is required', 400)); // Use next correctly
    }

    const user = await userModel.findOne({ _id: req.session.passport.user });
    if (!user) return next(new ErrorHandler('User not found', 404)); // Use next correctly

    const cachedUpload = await redisClient.get(req.file.originalname);
    let imageUrl;

    if (cachedUpload) {
        imageUrl = cachedUpload;
    } else {
        let result = await streamUpload(req);
        imageUrl = result.secure_url;
        await redisClient.set(req.file.originalname, imageUrl);
    }
    console.log(imageUrl);
    if (category === 'post') {
        console.log('post');
        const { error } = await validatePost({
            caption,
            picture: imageUrl,
            user: user._id.toString(),
        });

        if (error) return next(new ErrorHandler(error.message, 400)); // Use next correctly

        let post = await postModel.create({
            caption,
            picture: imageUrl,
            user: user._id,
        });
        user.posts.push(post._id);
        req.flash('success', 'Post created successfully');
    } else if (category === 'story') {
        console.log('story');
        const { error } = await validateStory({
            story: imageUrl,
            user: user._id.toString(),
        });

        if (error) return next(new ErrorHandler(error.message, 400)); // Use next correctly

        let story = await storyModel.create({
            story: imageUrl,
            user: user._id,
        });
        user.stories.push(story._id);
        req.flash('success', 'Story created successfully');
    }
    await user.save(); // Save the user after pushing posts or stories
    res.redirect('/user/feed');
});

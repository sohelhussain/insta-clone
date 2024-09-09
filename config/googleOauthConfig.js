var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { userModel } = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          user = new userModel({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.emails[0].value.split('@')[0] || `user_${Date.now()}`, // Generate a username
        });
        await user.save();
        }
        cb(null, user);
      } catch (error) {
        cb(error, false);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  return cb(null, user._id);
});
passport.deserializeUser(async (id, cb) => {
  let user = await userModel.findOne({ _id: id });
  cb(null, user);
});

module.exports = passport;

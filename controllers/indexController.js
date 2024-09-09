const {
  userModel,
  validateUser,
  validatePasswordReset,
} = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username or email
      const user = await userModel.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // Authenticate user using passport-local-mongoose's authenticate method
      user.authenticate(password, (err, result) => {
        if (err) return done(err);
        if (result) return done(null, user);
        return done(null, false, { message: "Incorrect password." });
      });
    } catch (err) {
      return done(err);
    }
  })
);
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const redisClient = require("../config/redisClient");
const { producer } = require("../kafka/kafkaConfig");

module.exports.registerPageController = (req, res) => {
  res.render("index", { footer: false });
  // res.send('index')
};
module.exports.loginPageController = (req, res) => {
  res.render("login", { footer: false });
  // res.send('index')
};
module.exports.forgotPasswordController = (req, res) => {
  res.render("forgot-password");
};
module.exports.resetPasswordPageController = (req, res) => {
  const { token } = req.params;
  res.render("reset-password", { token });
};

module.exports.logoutController = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
};

module.exports.registerController = async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    // Validate required fields
    if (!email || !name || !password) {
      return res.status(400).send("Email, Name, and Password are required.");
    }

    // Check if a user with the given email already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists.");
    }

    // Generate a username if not provided
    const generatedUsername =
      username || email.split("@")[0] || `user_${Date.now()}`;

    // Validate the input data
    const { error } = validateUser({
      username: generatedUsername,
      name,
      email,
      password,
    });
    if (error) {
      return res.status(400).send(error.message);
    }

    // Create a new user instance
    const newUser = new userModel({
      username: generatedUsername,
      name,
      email,
    });

    // Register the user using passport-local-mongoose
    userModel.register(newUser, password, (err, registeredUser) => {
      if (err) {
        console.error("Registration error:", err.message);
        return res.status(500).send("Error during registration.");
      }

      // Authenticate the user after registration
      passport.authenticate("local")(req, res, () => {
        res.redirect("/feed");
      });
    });
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).send("An unexpected error occurred.");
  }
};

//! forgot

module.exports.forgotPassword = async (req, res) => {
  const { error } = validateUser({ email: req.body.email });
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  // Generate Reset Token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  await user.save();

  // Produce a message to Kafka
  const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you requested a password reset. Please click on the link below or paste it into your browser to complete the process:\n\n${resetUrl}`;

  try {
    await producer.connect(); // Ensure producer is connected
    await producer.send({
      topic: "password-reset-requests",
      messages: [
        {
          value: JSON.stringify({ email, subject: "Password Reset", message }),
        },
      ],
    });
    res.send("Password reset request submitted successfully");
  } catch (err) {
    console.error("Error processing password reset request:", err);
    res.status(500).send("Error processing password reset request");
  } finally {
    await producer.disconnect(); // Disconnect after sending
  }
};

// resetPassword.js
module.exports.resetPassword = async (req, res) => {
  const { error } = validatePasswordReset({ password: req.body.password });
  if (error) return res.status(400).send(error.details[0].message);

  const { token, password } = req.body;

  // Check Redis cache for user data
  const cachedUser = await redisClient.get(token);
  let user;

  if (cachedUser) {
    user = JSON.parse(cachedUser);
    console.log("Using cached user data");
  } else {
    // Find the user by the reset token and ensure it hasn't expired
    user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) return res.status(400).send("Invalid or expired token");

    // Cache the user data in Redis
    await redisClient.set(token, JSON.stringify(user), "EX", 3600); // Cache expires in 1 hour
    console.log("Cached user data");
  }

  try {
    // Use Passport-Local-Mongoose method to set the new password
    await new Promise((resolve, reject) => {
      user.setPassword(password, async (err) => {
        if (err) return reject(err);

        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Clear cached data
        await redisClient.del(token);
        resolve();
      });
    });

    // Produce a message to Kafka
    await producer.connect(); // Ensure producer is connected
    await producer.send({
      topic: "password-reset-activities",
      messages: [
        {
          value: JSON.stringify({
            userId: user._id,
            action: "Password reset successful",
          }),
        },
      ],
    });

    res.send("Password has been reset successfully");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send("Error resetting password");
  } finally {
    await producer.disconnect(); // Disconnect after sending
  }
};

module.exports.feedController = (req, res) => {
  const stories = [];
  const user = { picture: "asdf" };
  const posts = [];
  res.render("feed", { footer: false });
  // res.send('index')
};

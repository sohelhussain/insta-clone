const mongoose = require('mongoose');
const Joi = require('joi');
const plm = require('passport-local-mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    picture: {
        type: String,
        default: 'def.png'
    },
    contact: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'story' }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

userSchema.plugin(plm);

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30),
        name: Joi.string().min(3).max(50),
        email: Joi.string().email(),
        password: Joi.string().max(1024),
        picture: Joi.string().optional(),
        contact: Joi.string().optional(),
        bio: Joi.string().max(500).optional(),
        stories: Joi.array().items(Joi.string().hex().length(24)),
        saved: Joi.array().items(Joi.string().hex().length(24)),
        posts: Joi.array().items(Joi.string().hex().length(24)),
        followers: Joi.array().items(Joi.string().hex().length(24)),
        following: Joi.array().items(Joi.string().hex().length(24)),
        resetPasswordToken: Joi.string().optional(),
        resetPasswordExpires: Joi.date().optional()
    });

    return schema.validate(user);
};

const validatePasswordReset = (data) => {
  const schema = Joi.object({
    password: Joi.string().max(1024) // No minimum length and not required
  });

  return schema.validate(data);
};


module.exports = {
  userModel: mongoose.model('user', userSchema),
  validateUser,
  validatePasswordReset // Export the new function
};
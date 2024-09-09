const mongoose = require('mongoose');
const Joi = require('joi'); // Import Joi for validation

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
  },
  picture: {
    type: String,
    default: "def.png"
  },
  contact: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "story"
    }
  ],
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ]
}, { timestamps: true });

// Joi Validation Schema for User
const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1024),
    picture: Joi.string().optional(),
    contact: Joi.string().optional(),
    bio: Joi.string().max(500).optional(),
    stories: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectId format
    saved: Joi.array().items(Joi.string().hex().length(24)),
    posts: Joi.array().items(Joi.string().hex().length(24)),
    followers: Joi.array().items(Joi.string().hex().length(24)),
    following: Joi.array().items(Joi.string().hex().length(24))
  });

  return schema.validate(user);
};

module.exports = {
  userModel: mongoose.model('user', userSchema),
  validateUser
};
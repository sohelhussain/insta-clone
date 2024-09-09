const mongoose = require('mongoose');
const Joi = require('joi'); // Import Joi for validation

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  like: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  comments: {
    type: Array,
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  },
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  picture: {
    type: String,
    trim: true
  }
});

// Joi Validation Schema for Post
const validatePost = (post) => {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(), // Must be a valid ObjectId
    caption: Joi.string().max(500).optional(),
    like: Joi.array().items(Joi.string().hex().length(24)), // Array of ObjectIds
    comments: Joi.array().items(Joi.string().optional()), // Array of strings (assuming comment text)
    date: Joi.date().optional(),
    shares: Joi.array().items(Joi.string().hex().length(24)), // Array of ObjectIds
    picture: Joi.string().optional()
  });

  return schema.validate(post);
};

module.exports = {
  postModel: mongoose.model("post", postSchema),
  validatePost
};
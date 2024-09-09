const mongoose = require('mongoose');
const Joi = require('joi'); // Import Joi for validation

const storySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  story: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Joi Validation Schema for Story
const validateStory = (story) => {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(), // Must be a valid ObjectId
    story: Joi.string().max(1000).required(), // Assuming the max length for a story is 1000 characters
    date: Joi.date().optional()
  });

  return schema.validate(story);
};

module.exports = {
  storyModel: mongoose.model("story", storySchema),
  validateStory
};
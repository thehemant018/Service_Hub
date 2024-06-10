const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  profId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional' }, 
  rating: { type: Number, required: true },
  feedback: { type: String }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;

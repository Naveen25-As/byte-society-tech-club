/**
 * Registration Model
 *
 * A "schema" defines the shape of documents stored in MongoDB.
 * A "model" is the class we use to create/read/update/delete those documents.
 *
 * Collection name in MongoDB will be "registrations" (mongoose pluralizes "Registration").
 */

const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Prevent duplicate registration: same email + same event
registrationSchema.index({ email: 1, eventName: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    status: {
      type: String,
      enum: ['lead', 'prospect', 'customer', 'inactive'],
      default: 'lead',
    },
    source: { type: String, trim: true, default: 'other' },
    tags: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

contactSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Contact', contactSchema);

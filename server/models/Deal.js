const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    value: { type: Number, default: 0 },
    stage: {
      type: String,
      enum: ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new',
    },
    expectedCloseDate: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);

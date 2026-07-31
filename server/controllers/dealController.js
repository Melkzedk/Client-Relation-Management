const Deal = require('../models/Deal');

const getDeals = async (req, res, next) => {
  try {
    const { stage } = req.query;
    const query = {};
    if (stage) query.stage = stage;

    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .populate('contact', 'name company email')
      .populate('owner', 'name');

    res.json(deals);
  } catch (err) {
    next(err);
  }
};

const getDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('contact').populate('owner', 'name');
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    next(err);
  }
};

const createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create({ ...req.body, owner: req.user._id });
    const populated = await deal.populate('contact', 'name company email');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('contact', 'name company email');
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    next(err);
  }
};

const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDeals, getDeal, createDeal, updateDeal, deleteDeal };

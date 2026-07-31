const Contact = require('../models/Contact');
const Deal = require('../models/Deal');
const Task = require('../models/Task');

// @desc  Aggregate stats for dashboard
// @route GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const [totalContacts, totalCustomers, openDeals, wonDeals, dealsByStage, pendingTasks, revenueAgg] =
      await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'customer' }),
        Deal.countDocuments({ stage: { $nin: ['won', 'lost'] } }),
        Deal.countDocuments({ stage: 'won' }),
        Deal.aggregate([{ $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } }]),
        Task.countDocuments({ status: { $ne: 'completed' } }),
        Deal.aggregate([{ $match: { stage: 'won' } }, { $group: { _id: null, total: { $sum: '$value' } } }]),
      ]);

    res.json({
      totalContacts,
      totalCustomers,
      openDeals,
      wonDeals,
      pendingTasks,
      totalRevenue: revenueAgg[0]?.total || 0,
      dealsByStage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };

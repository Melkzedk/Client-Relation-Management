const express = require('express');
const { getDeals, getDeal, createDeal, updateDeal, deleteDeal } = require('../controllers/dealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getDeals).post(createDeal);
router.route('/:id').get(getDeal).put(updateDeal).delete(deleteDeal);

module.exports = router;

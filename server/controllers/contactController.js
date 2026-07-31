const Contact = require('../models/Contact');

// @desc  Get all contacts (with search, filter, pagination)
// @route GET /api/contacts
const getContacts = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('owner', 'name email'),
      Contact.countDocuments(query),
    ]);

    res.json({ contacts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('owner', 'name email');
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({ ...req.body, owner: req.user._id });
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact };

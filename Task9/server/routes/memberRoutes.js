const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const members = await Member.find({
      $or: [
        { memberId: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { memberId, name, department, contact } = req.body;
    
    const existingMember = await Member.findOne({ memberId });
    if (existingMember) {
      return res.status(400).json({ error: 'Member ID already exists' });
    }

    const member = new Member({
      memberId,
      name,
      department,
      contact,
      issuedBooks: []
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, department, contact } = req.body;
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.name = name || member.name;
    member.department = department || member.department;
    member.contact = contact || member.contact;

    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

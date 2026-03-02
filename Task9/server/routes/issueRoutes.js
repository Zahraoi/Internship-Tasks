const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('book', 'bookId title author')
      .populate('member', 'memberId name')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/member/:memberId', async (req, res) => {
  try {
    const member = await Member.findOne({ memberId: req.params.memberId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    const issues = await Issue.find({ member: member._id, status: 'issued' })
      .populate('book', 'bookId title author');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { bookId, memberId, dueDays } = req.body;

    const book = await Book.findOne({ bookId });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.available <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    const member = await Member.findOne({ memberId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (dueDays || 14));

    const issue = new Issue({
      book: book._id,
      member: member._id,
      dueDate,
      status: 'issued'
    });

    await issue.save();

    book.available -= 1;
    await book.save();

    member.issuedBooks.push(issue._id);
    await member.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('book', 'bookId title author')
      .populate('member', 'memberId name');

    res.status(201).json(populatedIssue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/return/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue record not found' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    const returnDate = new Date();
    issue.returnDate = returnDate;
    issue.status = 'returned';

    if (returnDate > issue.dueDate) {
      const daysLate = Math.ceil((returnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
      issue.fine = daysLate * 10;
    } 
    // fine tu lagy ga na bhai

    await issue.save();

    const book = await Book.findById(issue.book);
    if (book) {
      book.available += 1;
      await book.save();
    }

    const populatedIssue = await Issue.findById(issue._id)
      .populate('book', 'bookId title author')
      .populate('member', 'memberId name');

    res.json(populatedIssue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

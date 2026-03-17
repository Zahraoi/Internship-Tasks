const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.user._id };
    
    if (month) {
      query.month = month;
    }

    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;
    
    const existingBudget = await Budget.findOne({
      userId: req.user._id,
      category,
      month
    });

    if (existingBudget) {
      existingBudget.monthlyLimit = monthlyLimit;
      const updated = await existingBudget.save();
      return res.json(updated);
    }

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      monthlyLimit,
      month
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/summary', protect, async (req, res) => {
  try {
    const { month } = req.query;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 1);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense'
        }
      },
      {
        $addFields: {
          txYear: { $year: '$date' },
          txMonth: { $month: '$date' }
        }
      },
      {
        $match: {
          txYear: parseInt(year),
          txMonth: parseInt(monthNum)
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const budgets = await Budget.find({ userId: req.user._id, month });

    const summary = budgets.map(budget => {
      const expense = expenses.find(e => e._id === budget.category);
      return {
        _id: budget._id,
        category: budget.category,
        budget: budget.monthlyLimit,
        spent: expense ? expense.total : 0,
        remaining: budget.monthlyLimit - (expense ? expense.total : 0)
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ 
      success: true, 
      message: 'Login successful',
      admin: { email: process.env.ADMIN_EMAIL }
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;

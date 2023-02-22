const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        console.error('Failed to save user', err);
        res.status(500).json({ message: 'Failed to save user' });
    }
});

module.exports = router;
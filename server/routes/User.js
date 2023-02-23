const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/getall', async (req, res) => {
    console.log("This route is working")
})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        console.log("Already registered")
        return res.status(409).json({ message: 'Already registered' })
    }

    const user = new User({ name, email, password });
    try {
        const savedUser = await user.save();
        console.log(savedUser);
        res.json(savedUser);
    } catch (err) {
        console.error('Failed to save user', err);
        res.status(500).json({ message: 'Failed to save user' });
    }
});

module.exports = router;
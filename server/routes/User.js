const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            console.log("Already registered")
            return res.status(409).json({ message: 'Already registered' })
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashedPass });

    
        const savedUser = await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        console.log(savedUser, { token });
        res.status(200).json({ savedUser, token });

    } catch (err) {
        console.error('Failed to register user', err);
        res.status(500).json({ message: 'Failed to register user' });
    }
});

router.post('/login', async (req, res) => {
    try {

        const {email, password} = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(404).json({ message: 'Invalid Credentials'});

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        console.log({token});
        res.json({ user, token });

    } catch (err) {
        res.status(500).json({ error: 'Could not log in'})
    }
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' })

        req.user = user;
        next();
    });
}

router.get('/getAll', verifyToken, async (req, res) => {
    console.log('GET ALL');
    const all = await User.find();
    console.log(all);
})

router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const user  = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    console.log('Wokring...');
    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(403).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' })
    }
});

module.exports = router;
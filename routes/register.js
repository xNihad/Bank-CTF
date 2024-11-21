const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); 

const router = express.Router();

router.get('/', (req, res) => {
    res.render('register', { error: null });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.render('register', { error: 'Username already taken.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create(username, hashedPassword);

        res.redirect('/login');
    } catch (error) {
        console.error('Registration Error:', error);
        res.render('register', { error: 'An error occurred. Please try again later.' });
    }
});

module.exports = router;

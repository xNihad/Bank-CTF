const express = require('express');
const bcrypt = require('bcryptjs'); 
const User = require('../models/user'); 
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', { error: null }); 
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        req.session.userId = user.id;
        req.session.username  = user.username;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login Error:', error);
        res.render('login', { error: 'An error occurred. Please try again later.' });
    }
});

module.exports = router;

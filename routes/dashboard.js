const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.session.username || 'User' });
});

module.exports = router;

const express = require('express');
const path = require('path');
const Support = require('../models/support');
const multer = require('multer');
const router = express.Router();

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});

router.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const supports = await Support.getAllByUserId(req.session.userId);
        res.render('support', { 
            supports,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error('Error fetching support data:', error);
        res.status(500).render('support', { 
            supports: [],
            error: 'Error fetching support data'
        });
    }
});

router.post('/submit', upload.single('upload'), async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const { cafer, message } = req.body;

        if (!cafer || !message) {
            return res.redirect('/support?error=' + encodeURIComponent('Username and message are required'));
        }

        const filePath = req.file ? req.file.path : null;

        await Support.create(req.session.userId, cafer, message, filePath);

        res.redirect('/support?success=' + encodeURIComponent('Support request submitted successfully'));
    } catch (error) {
        console.error('Error submitting support request:', error);
        res.redirect('/support?error=' + encodeURIComponent('An error occurred while submitting your request'));
    }
});

module.exports = router;

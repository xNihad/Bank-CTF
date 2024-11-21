const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filesDir = path.join(__dirname, '../balance-transfer');

router.get('/', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to read files directory.');
        }

        const fileData = files
            .filter((file) => file.endsWith('.acc')) 
            .map((file) => {
                const filePath = path.join(filesDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    lastModified: stats.mtime,
                    size: stats.size,
                };
            });

        res.render('balance-transfer', { files: fileData });
    });
});

router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(filesDir, fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found.');
    }
});

module.exports = router;

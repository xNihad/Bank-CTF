const db = require('./db');

const Support = {
    create: async (userId, username, message, filePath) => {
        const [result] = await db.query(
            'INSERT INTO support (user_id, username, message, file_path) VALUES (?, ?, ?, ?)',
            [userId, username, message, filePath]
        );
        return result.insertId;
    },
    getAllByUserId: async (userId) => {
        const [rows] = await db.query(
            'SELECT * FROM support WHERE user_id = ?',
            [userId]
        );
        return rows;
    },
};

module.exports = Support;

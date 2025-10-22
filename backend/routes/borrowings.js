const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET all borrowings
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const [rows] = await db.query(
            `SELECT br.*, r.name AS reader_name, b.title AS book_title
             FROM borrowings br
             LEFT JOIN readers r ON br.reader_id = r.id
             LEFT JOIN books b ON br.book_id = b.id
             ORDER BY br.id`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET borrowing by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT * FROM borrowings WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Borrowing not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST create new borrowing
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { reader_id, book_id, borrow_date, return_date } = req.body;

        if (!reader_id || !book_id || !borrow_date) {
            return res.status(400).json({ error: 'Missing required fields: reader_id, book_id, borrow_date' });
        }

        // Check if reader exists
        const [r] = await db.query('SELECT id FROM readers WHERE id = ?', [reader_id]);
        if (r.length === 0) return res.status(400).json({ error: 'Provided reader_id does not exist' });

        // Check if book exists
        const [b] = await db.query('SELECT id FROM books WHERE id = ?', [book_id]);
        if (b.length === 0) return res.status(400).json({ error: 'Provided book_id does not exist' });

        const [result] = await db.query(
            'INSERT INTO borrowings (reader_id, book_id, borrow_date, return_date) VALUES (?, ?, ?, ?)',
            [reader_id, book_id, borrow_date, return_date || null]
        );

        const [rows] = await db.query('SELECT * FROM borrowings WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT update borrowing by ID
router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { reader_id, book_id, borrow_date, return_date } = req.body;

        if (!reader_id || !book_id || !borrow_date) {
            return res.status(400).json({ error: 'Missing required fields: reader_id, book_id, borrow_date' });
        }

    
        const [r] = await db.query('SELECT id FROM readers WHERE id = ?', [reader_id]);
        if (r.length === 0) return res.status(400).json({ error: 'Provided reader_id does not exist' });

       
        const [b] = await db.query('SELECT id FROM books WHERE id = ?', [book_id]);
        if (b.length === 0) return res.status(400).json({ error: 'Provided book_id does not exist' });

        const [result] = await db.query(
            'UPDATE borrowings SET reader_id = ?, book_id = ?, borrow_date = ?, return_date = ? WHERE id = ?',
            [reader_id, book_id, borrow_date, return_date || null, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Borrowing not found' });

        const [rows] = await db.query('SELECT * FROM borrowings WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [result] = await db.query('DELETE FROM borrowings WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Borrowing not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM authors ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});


router.get('/:id',authenticateToken,  async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows] = await db.query('SELECT * FROM authors WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Author not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


router.post('/',authenticateToken, async (req, res, next) => {
  try {
    const { name, country, birth_year, bio } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const [result] = await db.query(
      'INSERT INTO authors (name, country, birth_year, bio) VALUES (?, ?, ?, ?)',
      [name, country || null, birth_year || null, bio || null]
    );

    const [rows] = await db.query('SELECT * FROM authors WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, country, birth_year, bio } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const [result] = await db.query(
      'UPDATE authors SET name = ?, country = ?, birth_year = ?, bio = ? WHERE id = ?',
      [name, country || null, birth_year || null, bio || null, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Author not found' });

    const [rows] = await db.query('SELECT * FROM authors WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [result] = await db.query('DELETE FROM authors WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Author not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

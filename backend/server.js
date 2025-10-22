const express = require('express');
const cors = require('cors');
require('dotenv').config();


const booksRouter = require('./routes/books');
const readerRouter = require('./routes/readers');
const authorsRouter = require('./routes/authors');
const borrowingsRouter = require('./routes/borrowings');

const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('./api/users', usersRouter);

app.use('/api/books', booksRouter);
app.use('/api/readers', readerRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/borrowings', borrowingsRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

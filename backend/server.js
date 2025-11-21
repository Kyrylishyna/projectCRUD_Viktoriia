const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');



const booksRouter = require('./routes/books');
const readerRouter = require('./routes/readers');
const authorsRouter = require('./routes/authors');
const borrowingsRouter = require('./routes/borrowings');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://myfirstrealwebsite.netlify.app'
}));
//app.options('*', cors());
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.json());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// API routes
app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/readers', readerRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/borrowings', borrowingsRouter);

app.get('/home', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'frontend', 'public_page', 'public_page.html');
    console.log(' Serving home page from:', filePath);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving home page:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.get('/main', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'frontend', 'main-page.html');
    console.log(' Serving main page from:', filePath);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving main page:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.get('/reset-password', (req, res) => {
  try{
    const filePath = path.join(__dirname, '..', 'frontend', 'public_page', 'reset_password.html');
    res.sendFile(filePath);
  }catch(error){
    console.error("Error serving reset password page:", error);
    res.status(500).send("Server error:" + error.message);
  }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});

});

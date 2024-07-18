const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const corsOptions = {
    origin: 'http://localhost:5173', // React app URL
    credentials: true, // to accept cookies from the client
  };
  
  app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 * 60 * 24 * 7 } // 7 days
}));

app.get('/checkAuth', (req, res) => {
    if (req.session.user) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/user', userRoutes)
app.use('/role', roleRoutes)
app.use('/auth', authRoutes)
app.use('/book', bookRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the lovoj API');
});

//save to database
const port = process.env.PORT || 8000;
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;

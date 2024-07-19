const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

app.use(cors());
app.use(bodyParser.json());


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

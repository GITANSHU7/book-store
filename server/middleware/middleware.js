const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

// const isAuthenticated = (req, res, next) => {
//     if (!req.session || !req.session.user) {
//         console.log(req.session);
//         console.log(req.session.user);

//         return res.status(401).json({ message: 'Access denied. User not logged in.' });
//     }

   
//     next();
// };

// module.exports = isAuthenticated;

// const isAuthenticated = (req, res, next) => {
//     if (!req.session || !req.session.user) {
//         console.log("Session:", req.session);
//         console.log("User:", req.session ? req.session.user : null);

//         return res.status(401).json({ message: 'Access denied. User not logged in.' });
//     }

//     next();
// };

// module.exports = isAuthenticated;

// make a middleware function to check if user is authenticated or not
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = isAuthenticated;

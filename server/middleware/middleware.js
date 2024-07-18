
const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Access denied. User not logged in.' });
    }

   
    next();
};

module.exports = isAuthenticated;

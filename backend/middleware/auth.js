const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware function to verify the token

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({error: 'Access denied: no token provided'});

    jwt.verify(token, JWT_SECRET, (err, user)=> {
        if(err) return res.status(403).json({error: 'Invalid or expired token'});
    
        req.user = user;
        next();
    });
}


function authorizeRole(...roles){
    return (req, res, next) => {
        if(!req.user) return res.status(401).json({error:'Access denied: no user info'});
        if (!roles.includes(req.user.role)) return res.status(403).json({error: 'Forbidden: insufficient permissions'});
        next();
    };
}


module.exports = {authenticateToken, authorizeRole};
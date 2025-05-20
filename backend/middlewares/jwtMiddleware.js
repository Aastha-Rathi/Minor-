// const jwt = require('jsonwebtoken');


// function authenticateJWT(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }

//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// }

// module.exports = authenticateJWT;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user in the database to ensure they exist
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user info properly on the request object
    req.user = {
      id: decoded.id,  // This is what userController expects
      _id: user._id,
      userId: user.userId,
      username: user.username
    };
    
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Unauthorized - Invalid token', error: err.message });
  }
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }

    console.log('Token received:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findOne({ 
      where: { id: decoded.id }
    });

    if (!user) {
      console.log('User not found with id:', decoded.id);
      throw new Error('User not found');
    }

    req.user = user;
    console.log('User authenticated:', user.id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Please authenticate',
      error: error.message 
    });
  }
};

module.exports = auth; 
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Please authenticate to access this resource'
    });
  }
};

const requireSubscription = (plan) => async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Define plan hierarchy
    const planHierarchy = {
      'free': 0,
      'pro': 1,
      'business': 2
    };

    const requiredLevel = planHierarchy[plan];
    const userLevel = planHierarchy[user.subscription.plan];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a ${plan} subscription`
      });
    }

    // Check if subscription is active
    if (user.subscription.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your subscription is not active'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking subscription'
    });
  }
};

module.exports = { auth, requireSubscription };
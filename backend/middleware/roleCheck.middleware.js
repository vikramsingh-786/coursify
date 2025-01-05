const roleCheck = (requiredRoles) => {
    return (req, res, next) => {

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Forbidden - Insufficient permissions',
          userRole: req.user.role,
          requiredRoles: requiredRoles 
        });
      }
  
      next();
    };
  };

  module.exports = roleCheck;
  
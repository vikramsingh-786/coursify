const debugFormData = (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('Form Fields:');
      for (const [key, value] of Object.entries(req.body)) {
        console.log(`${key}:`, value);
      }
    }
    
    next();
  };
  
  module.exports = debugFormData;
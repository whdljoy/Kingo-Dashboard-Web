const crypto = require('crypto');
module.exports = {
    hashing: function(data) {
      if (!data) {
        return data;
      }
      
      const hash = crypto.createHash('sha512')
                          .update(data)
                          .digest('hex');
  
      return hash;
    }
  }
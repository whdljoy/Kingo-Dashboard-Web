// const jwt = require('jsonwebtoken');
// module.exports = {
//     hashing: function(data) {
//       if (!data) {
//         return data;
//       }
      
//       const hash = crypto.createHash('sha512')
//                           .update(data)
//                           .digest('hex');
  
//       return hash;
//     },
//     authenticateAccessToken : function (req, res, next) {
//       let authHeader = req.headers["authorization"];
//       let token = authHeader && authHeader.split(" ")[1];
  
//       if (!token) {
//           console.log("wrong token format or token is not sended");
//           return res.sendStatus(400);
//       }
  
//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
//           if (error) {
//               console.log(error);
//               return res.sendStatus(403);
//           }
          
//           req.user = user;
//           next();
//       });
//     };
//   }
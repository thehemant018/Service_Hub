var jwt=require('jsonwebtoken');
var JWT_SECRET='TumseNaHoPayega';
// fetchuser=(req,res,next)=>{
//     const token=req.header('auth-token');
//     if(!token){
//         res.status(401).send({ error: 'Please authenticate using valid token' });
//     }
//     try {
//         const data=jwt.verify(token,JWT_SECRET);
//         req.user=data.user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate using valid token' });
//     }
// }



const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
  
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
  
    try {
        // console.log('Received Token:', token);
        // console.log(token);
        const data = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded Token Payload:', data);
  
        // Assuming the 'user' field is an object with 'id' property
        req.user = data.user || {};  // Set an empty object as a fallback
        
        // Log the decoded user data for debugging purposes
        console.log('Decoded User Data:', req.user);
  
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
  }
module.exports=fetchuser;
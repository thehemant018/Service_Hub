// var jwt=require('jsonwebtoken');
// var JWT_SECRET='TumseNaHoPayega';
// fetchprofs=(req,res,next)=>{
//     const token=req.header('auth-token');
//     if(!token){
//         res.status(401).send({ error: 'Please authenticate using valid token' });
//     }
//     try {
//         const data=jwt.verify(token,JWT_SECRET);
//         console.log(data);
//         req.professional=data.professional;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate using valid token' });
//     }
// }
// module.exports=fetchprofs;

// var jwt = require('jsonwebtoken');
// var JWT_SECRET = 'TumseNaHoPayega';
var jwt=require('jsonwebtoken');
var JWT_SECRET='TumseNaHoPayega';

// fetchprofs = (req, res, next) => {
//     const token = req.header('auth-token');
//     if (!token) {
//         return res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }
//     try {
//         const data = jwt.verify(token, JWT_SECRET);
//         console.log(data);
//         req.professional = data.professional;
//         next();
//     } catch (error) {
//         console.error('Token verification error:', error.message);
//         res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }
// };


// const fetchprofs = (req, res, next) => {
//     const token = req.header('auth-token');
//     if (!token) {
//         return res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }
//     try {
//         const data = jwt.verify(token, JWT_SECRET);
//         console.log(data);
//         req.professional = data.professional || {};
//         next();
//         console.log('Decoded User Data:', req.professional);
//     } catch (error) {
//         console.error('Token verification error:', error.message);
//         res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }
// };
// const fetchprofs = (req, res, next) => {
//     const token = req.header('auth-token');
//     console.log('Received Token:', token);

//     if (!token) {
//         return res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }

//     try {
//         // const data = jwt.verify(token, JWT_SECRET);
//         const data = jwt.verify(token, JWT_SECRET);
//         console.log('Decoded Token Data:', data);

//         // Ensure that the professional property is set correctly
//         req.professional = data.professional || null;
//         next();

//         console.log('Decoded User Data:', req.professional);
//     } catch (error) {
//         console.error('Token verification error:', error.message);
//         res.status(401).send({ error: 'Please authenticate using a valid token' });
//     }
// };


const fetchprofs = (req, res, next) => {
    const token = req.header('auth-token');
    // console.log('Received Token:', token);

    if (!token) {
        return res.status(401).send({ error: 'Please authenticate using a valid token' });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded Token Data:', data);

        
        req.professional = data.professional || null;
        // console.log('Set Professional Data:', req.professional);

        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).send({ error: 'Please authenticate using a valid token' });
    }
};

module.exports = fetchprofs;



module.exports = fetchprofs;

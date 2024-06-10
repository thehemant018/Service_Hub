const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin');

const JWT_SECRET = 'marcos';

router.post('/createadmin', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (admin)
            return res.status(400).json({ success: false, error: 'Admin with this email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = new Admin({ email, password: hashedPassword });

        await admin.save();

        const data = {
            admin: { id: admin.id }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({ success: true, authToken });
    }

    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

//  login admin
router.post('/loginadmin', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
     
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success, error: 'Invalid credentials' });
        }

        const data = {
            admin: { id: admin.id }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: 'Internal server error' });
    }
});


router.post('/validate', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            } else {
                return res.json({ valid: true });
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});



module.exports = router;

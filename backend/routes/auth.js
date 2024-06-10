const express = require('express')
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = express.Router();
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'TumseNaHoPayega';
var fetchuser = require('../middleware/fetchuser')


router.post(
    '/createuser',
    [
        body('name', 'Enter valid name').isLength({ min: 3 }),
        body('email', 'Enter valid email').isEmail(),
        body('password', 'Passwords must be at least 5 characters').isLength({ min: 5 }),
        body('latitude', 'Enter valid latitude').isNumeric(),
        body('longitude', 'Enter valid longitude').isNumeric(),
    ],
    async (req, res) => {
        // validate result
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: 'Sorry, a user with this email already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
                contact: req.body.contact,
                address: req.body.address,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                },
            });

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Internal server error');
        }
    }
);


router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Passwords cannot be blank').exists()
], async (req, res) => {
    let success = false;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }

        const comparepassword = await bcrypt.compare(password, user.password)
        if (!comparepassword) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server Error');
    }
})



router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('userId:', userId);

        const user = await User.findById(userId).select("-password");
        console.log('User:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

router.get('/getallusers',async(req,res)=>{
    try {
        const users=await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})



router.put(
    '/update-location',
    [
        fetchuser, // Ensure the user is authenticated
        body('latitude', 'Enter a valid latitude').isNumeric(),
        body('longitude', 'Enter a valid longitude').isNumeric(),
    ],
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { latitude, longitude } = req.body;
            const userId = req.user.id;

            // Update user's location in the database
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)],
                        },
                    },
                },
                { new: true }
            );

            res.json({ success: true, message: 'Location updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

router.delete('/deleteuser/:userId', async (req, res) => {
    const userId = req.params.userId; // Corrected parameter name
    try {
        await User.findByIdAndDelete(userId);
        console.log('User deleted successfully')
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get("/getUserCount", async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.json({ count: userCount });
    } catch (error) {
      console.error("Error fetching user count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;
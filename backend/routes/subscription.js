const express = require('express');
const User = require('../models/User');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');


router.get('/subscriptionsRequest', async (req, res) => {
    try {
        const usersWithPendingSubscriptions = await User.find({ subscriptionStatus: 'pending' }).select('-password');
        res.json(usersWithPendingSubscriptions);
    } catch (error) {
        console.error('Error fetching users with pending subscriptions:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/accept/:subscriptionId', async (req, res) => {
    const userId = req.params.subscriptionId;
    try {
       
        const updatedSubscription = await User.findByIdAndUpdate(
            userId,
            { subscriptionStatus: 'accepted' }, 
            { new: true } 
        );

        res.json(updatedSubscription);
    } catch (error) {
        console.error('Error accepting subscription:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/getPendingSubscriptionCount", async (req, res) => {
    try {
      const pendingSubscriptionCount = await User.countDocuments({ status: 'pending' });
      res.json({ count: pendingSubscriptionCount });
    } catch (error) {
      console.error("Error fetching pending subscription count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/getSubscriptionCount", async (req, res) => {
    try {
      
      const subscriptionCount = await User.countDocuments();
      res.json({ count: subscriptionCount });
    } catch (error) {
      console.error("Error fetching subscription count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;

const express = require('express')
const Query = require('../models/Query');
const router = express.Router();


router.post('/upload-query', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, message } = req.body;

      const newQuery = new Query({
        firstName,
        lastName,
        email,
        phone,
        message
      });
      await newQuery.save();

      res.status(201).json({ message: 'Query uploaded successfully' });
    } catch (error) {
      console.error('Error uploading query:', error);
      res.status(500).json({ error: 'Unable to upload query' });
    }
  });

  router.get('/fetch-all-queries', async (req, res) => {
    try {
      const queries = await Query.find();
      res.json(queries);
    } catch (error) {
      console.error('Error fetching queries:', error);
      res.status(500).json({ error: 'Unable to fetch queries' });
    }
  });

module.exports = router;
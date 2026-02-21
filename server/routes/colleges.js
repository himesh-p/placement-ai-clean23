const express = require('express');
const router = express.Router();
const { gujaratColleges, companiesDatabase } = require('../data/database');

router.get('/', (req, res) => {
  res.json({ colleges: gujaratColleges });
});

router.get('/companies', (req, res) => {
  res.json({ companies: companiesDatabase });
});

module.exports = router;

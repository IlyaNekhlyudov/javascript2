const express = require('express');
const fs = require('fs');
const handler = require('./handler');
const router = express.Router();

router.post('/', (req, res) => {
    handler(req, res, 'add', './server/db/orders.json');
});

module.exports = router;
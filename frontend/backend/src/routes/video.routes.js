const express = require('express');
const router = express.Router();

router.get('/:id/preview', (req, res) => res.json({ message: 'Video preview' }));

module.exports = router;

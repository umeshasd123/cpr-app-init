const express = require('express');
const router = express.Router();

// Endpoint to process Ref.Ids
router.post("", (req, res) => {
    const refIds = req.body;

    // Validate input
    if (!Array.isArray(refIds) || refIds.length === 0) {
        return res.status(500).json({ error: "Invalid request: refIds must be a non-empty array" });
    }

    // Send response
    res.json({ message: `Ref ids [${refIds.join(', ')}] processed successfully` });
});

module.exports = router;
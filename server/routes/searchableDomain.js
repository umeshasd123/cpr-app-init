const express = require('express');
const router = express.Router();

router.get("", (req, res) => {
    // if (!mockData) {
    //     return res.status(500).json({ error: "Invalid JSON format" });
    // }
    // const findAttr = mockData.find(item => item["ref_id"] === Number(req.query.refId));
    const tempRefObj = [
        {
            SEARCH_ID: Math.floor(Math.random() * 10000),
            UNIQUE_IDENTIFIER: '23423ertv45' + Math.floor(Math.random() * 10000),
            ITEM_NAME: 'ew34 b43twet',
            ITEM_VALUE: 'dfgdfg',
            PRIMARY_TYPE: '',
            ITEM_ORDER: '',
            INSERTION_TIME: new Date(new Date() + Math.floor(Math.random() * 86400000))
        }
    ];

    // Send response

    setTimeout(() => {
        res.json(tempRefObj);
    }, 1000);
});



module.exports = router;
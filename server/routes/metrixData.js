const express = require("express");
const router = express.Router();
const fs = require("fs");

// Load mock data
let mockData;
try {
    mockData = JSON.parse(fs.readFileSync('MockData.json', 'utf-8'));
} catch (error) {
    console.error("Error reading MockData.json:", error);
    mockData = null;
}

router.get('', (req, res) => {
    if (!mockData) {
        return res.status(500).json({ error: "Invalid JSON format" });
    }

    let {
        page = 1,
        limit = 20,
        search = '',
        status = "",
        fromDate = null,
        toDate = null,
        type = ""
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let filteredData = mockData;
    const dateOnly = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (status) {
        filteredData = filteredData.filter(row => row.status.toLowerCase() === status.toLowerCase());
    }
    if (fromDate) {
        filteredData = filteredData.filter(row => {
            return dateOnly(new Date(row.creationdate)) >= dateOnly(new Date(fromDate))
        });
    }
    if (toDate) {
        filteredData = filteredData.filter(row => dateOnly(new Date(row.creationdate)) <= dateOnly(new Date(toDate)));
    }
    if (type) {
        filteredData = filteredData.filter(row => row.type === type);
    }
    if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(row =>
            Object.values(row).some(value => String(value).toLowerCase().includes(lowerSearch))
        );
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    res.json({ total, data: paginatedData });
})

module.exports = router;
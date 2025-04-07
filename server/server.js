const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// The port number on which the server will listen for incoming requests.
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Load mock data
let mockData;
try {
    mockData = JSON.parse(fs.readFileSync('MockData.json', 'utf-8'));
} catch (error) {
    console.error("Error reading MockData.json:", error);
    mockData = null;
}

app.get('/metrix-data', (req, res) => {
    if (!mockData) {
        return res.status(500).json({ error: "Invalid JSON format" });
    }

    let { 
        page = 1, 
        limit = 50, 
        search = '', 
        status = "", 
        fromDate = null, 
        toDate = null,
        type = ""
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    
    let filteredData = mockData;
    if (status) {
        filteredData = filteredData.filter(row => row.status === status);
    }
    if (fromDate) {
        filteredData = filteredData.filter(row => new Date(row.creationdate) >= new Date(fromDate));
    }
    if (toDate) {
        filteredData = filteredData.filter(row => new Date(row.creationdate) <= new Date(toDate));
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

/*
    const filePath = path.join(__dirname, "mockData.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read data" });
        }

        try {
            const logs = JSON.parse(data);
            res.json(logs);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
    */
})

// Endpoint to process Ref.Ids
app.post("/api/resend", (req, res) => {
    const refIds  = req.body;

    // Validate input
    if (!Array.isArray(refIds) || refIds.length === 0) {
        return res.status(500).json({ error: "Invalid request: refIds must be a non-empty array" });
    }

    // Send response
    res.json({ message: `Ref ids [${refIds.join(', ')}] processed successfully` });
});

// Endpoint to get searchable attributes
app.get("/api/getattributes", (req, res) => {    
    if (!mockData) {
        return res.status(500).json({ error: "Invalid JSON format" });
    }
    const findAttr = mockData.find(item => item["ref_id"] === Number(req.query.refId));

    // Send response
    
    setTimeout(() => {
        res.json(findAttr);
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const path = require("path");
// Serve frontend build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

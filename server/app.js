const cors = require("cors");
const express = require("express");
const app = express();
const mtrixDataRouter = require("./routes/metrixData.js");
const resendRouter = require("./routes/resend.js");
const searchableDomainRouter = require("./routes/searchableDomain.js");

app.use(express.json());
app.use(cors());

// This middleware will set the CORS headers for all incoming requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
    next();
});

// Set the port to 5000 or the port from environment variables
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Endpoint to get metrix data
app.use('/api/metrix-data', mtrixDataRouter);

// Endpoint to process Ref.Ids
app.use("/api/resend", resendRouter);

// Endpoint to get searchable attributes
app.use("/api/getattributes", searchableDomainRouter);


module.exports = app;
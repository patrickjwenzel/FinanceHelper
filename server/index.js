// Package imports
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();

// File imports
const fileUtils = require("./apis/utils/fileUtils");

// App setup
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

// APIs

app.get("/analysis/:period", (req, res) => {
    const totals = fileUtils.mergeFiles(req);
    res.json(totals);
});

app.get("/analysis/:period/min/:min", (req, res) => {
    const totals = fileUtils.mergeFiles(req);
    res.json(totals);
});

app.get("/analysis/:period/max/:max", (req, res) => {
    const totals = fileUtils.mergeFiles(req);
    res.json(totals);
});

app.get("/analysis/:period/min/:min/max/:max", (req, res) => {
    const totals = fileUtils.mergeFiles(req);
    res.json(totals);
});

// Set up listening
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Package imports
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// File imports
const analyze = require("./apis/analyze");
const ccTab = require("./apis/ccTab");

// App setup
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

// APIs

// ---------- Analysis Tab ----------
app.get("/analysis/:period", (req, res) => {
    const totals = analyze.mergeBanks(req);
    res.json(totals);
});

app.get("/analysis/:period/min/:min", (req, res) => {
    const totals = analyze.mergeBanks(req);
    res.json(totals);
});

app.get("/analysis/:period/max/:max", (req, res) => {
    const totals = analyze.mergeBanks(req);
    res.json(totals);
});

app.get("/analysis/:period/min/:min/max/:max", (req, res) => {
    const totals = analyze.mergeBanks(req);
    res.json(totals);
});

// ---------- CC Tab ----------
// ---------- Overall ----------
app.get("/ccTab/overall/:period", (req, res) => {
    const totals = ccTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/ccTab/overall/:period/min/:min", (req, res) => {
    const totals = ccTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/ccTab/overall/:period/max/:max", (req, res) => {
    const totals = ccTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/ccTab/overall/:period/min/:min/max/:max", (req, res) => {
    const totals = ccTab.getCCOverallPurchases(req);
    res.json(totals);
});

// ---------- Insights ----------
app.get("/ccTab/insight/:insight/period/:period/date/:date", (req, res) => {
    const totals = ccTab.getCCInsightPurchases(req);
    res.json(totals);
});

// Set up listening
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

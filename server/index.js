// Package imports
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// File imports
const analyze = require("./apis/analyze");
const ccTab = require("./apis/ccTab");
const recurring = require("./apis/recurring");
const commonUtils = require("./apis/utils/commonUtils");

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

// ---------- Recurring Payments ----------
// ---------- Overall ----------
app.get("/recurring/:chartType", (req, res) => {
    req.params.period = "monthly";
    const bills = commonUtils.mergeBills(req);

    res.json(bills);
});

app.get("/recurring/:chartType/date/:date", (req, res) => {
    req.params.period = "monthly";
    const bills = commonUtils.mergeBills(req);

    res.json(bills);
});

// ---------- By Type ----------
app.get("/recurring/:chartType/:type", (req, res) => {
    req.params.period = "monthly";
    const totals = recurring.getRecurringPayments(req);
    res.json(totals);
});

app.get("/recurring/:chartType/:type/date/:date", (req, res) => {
    req.params.period = "monthly";
    const totals = recurring.getRecurringPayments(req);
    res.json(totals);
});

// Set up listening
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

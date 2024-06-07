// Package imports
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// File imports
const analyze = require("./apis/analyze");
const spendingTab = require("./apis/spendingTab");
const recurring = require("./apis/recurring");
const bank = require("./apis/bank");
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
app.get("/spendingTab/overall/:period", (req, res) => {
    const totals = spendingTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/spendingTab/overall/:period/min/:min", (req, res) => {
    const totals = spendingTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/spendingTab/overall/:period/max/:max", (req, res) => {
    const totals = spendingTab.getCCOverallPurchases(req);
    res.json(totals);
});

app.get("/spendingTab/overall/:period/min/:min/max/:max", (req, res) => {
    const totals = spendingTab.getCCOverallPurchases(req);
    res.json(totals);
});

// ---------- Insights ----------
app.get(
    "/spendingTab/insight/:insight/period/:period/date/:date",
    (req, res) => {
        const totals = spendingTab.getCCInsightPurchases(req);
        res.json(totals);
    }
);

// ---------- Recurring Payments ----------
// ---------- Overall ----------
app.get(
    "/recurring/:chartType/:type/showPaychecks/:showPaychecks",
    (req, res) => {
        req.params.period = "monthly";
        req.params.usePie = req.params.chartType === "pie";
        const showPaychecks = req.params.showPaychecks === "true";
        req.params.showPaychecks = false;
        const tempType = req.params.type;

        const bills =
            req.params.type === "all"
                ? commonUtils.mergeBills(req)
                : recurring.getRecurringPayments(req);

        req.params.type = tempType;

        res.json(recurring.getReturnJson(showPaychecks, req, bills));
    }
);

app.get(
    "/recurring/:chartType/:type/date/:date/showPaychecks/:showPaychecks",
    (req, res) => {
        req.params.period = "monthly";
        req.params.usePie = req.params.chartType === "pie";
        const showPaychecks = req.params.showPaychecks === "true";
        req.params.showPaychecks = false;
        const tempType = req.params.type;

        const bills =
            req.params.type === "all"
                ? commonUtils.mergeBills(req)
                : recurring.getRecurringPayments(req);

        req.params.type = tempType;

        res.json(recurring.getReturnJson(showPaychecks, req, bills));
    }
);

// ---------- By Type ----------
app.get("/recurring/:chartType/:type", (req, res) => {
    req.params.period = "monthly";
    req.params.showPaychecks = false;

    const bills = recurring.getRecurringPayments(req);

    res.json(bills);
});

app.get("/recurring/:chartType/date/:date/:type", (req, res) => {
    req.params.period = "monthly";
    req.params.showPaychecks = false;

    const bills = recurring.getRecurringPayments(req);

    res.json(bills);
});

// ---------- Bank Tab ----------
app.get("/bank/:period", (req, res) => {
    const totals = bank.getBankBalances(req);
    res.json(totals);
});

app.get("/bank/:period/min/:min", (req, res) => {
    const totals = bank.getBankBalances(req);
    res.json(totals);
});

app.get("/bank/:period/max/:max", (req, res) => {
    const totals = bank.getBankBalances(req);
    res.json(totals);
});

app.get("/bank/:period/min/:min/max/:max", (req, res) => {
    const totals = bank.getBankBalances(req);
    res.json(totals);
});

// Set up listening
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const _ = require("lodash");
const moment = require("moment");

const recurringFileUtils = require("./utils/recurringFileUtils");
const commonUtils = require("./utils/commonUtils");
const env = require("../env");

function getRecurringPayments(req) {
    // Sum up CC purchases
    let ccPurchases = null;
    if (!req.params.showPaychecks) {
        const ccExcludes = env.vars["CC_EXCLUDE"];
        const ccFolderContents =
            commonUtils.iterateBankFolder("CC_CSV_LOCATION");
        ccPurchases = commonUtils.iterateFilesInFolder(
            ccFolderContents.fileNames,
            ccFolderContents.folderPath,
            recurringFileUtils.bankFileAnalysisRecurring,
            req,
            "CC_CSV_PREFIX",
            commonUtils.ccFileNoPrefix,
            1,
            5,
            true,
            ccExcludes,
            false,
            2,
            true
        );
    }

    // Sum up SC purchases
    const scExcludes = env.vars["SC_EXCLUDE"];
    const scFolderContents = commonUtils.iterateBankFolder("SC_CSV_LOCATION");
    const scPurchases = commonUtils.iterateFilesInFolder(
        scFolderContents.fileNames,
        scFolderContents.folderPath,
        recurringFileUtils.bankFileAnalysisRecurring,
        req,
        "SC_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        3,
        false,
        scExcludes,
        false,
        1,
        true
    );

    // Sum up SS purchases
    const ssExcludes = env.vars["SS_EXCLUDE"];
    const ssFolderContents = commonUtils.iterateBankFolder("SS_CSV_LOCATION");
    const ssPurchases = commonUtils.iterateFilesInFolder(
        ssFolderContents.fileNames,
        ssFolderContents.folderPath,
        recurringFileUtils.bankFileAnalysisRecurring,
        req,
        "SS_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        3,
        false,
        ssExcludes,
        false,
        1,
        true
    );

    let purchases = scPurchases.concat(ssPurchases);

    if (ccPurchases) {
        purchases = purchases.concat(ccPurchases);
    }

    const tempObj = {};
    const returnObj = {};

    _.forEach(purchases, (purchase) => {
        if (purchase.date) {
            const date = moment(purchase.date).format("MM/YYYY");
            const arr = [];

            _.forEach(Object.keys(purchase.insights), (key) => {
                arr.push({
                    name: key,
                    amount: purchase.insights[key] * -1,
                });
            });

            if (tempObj[date] === undefined) {
                tempObj[date] = arr;
            } else {
                tempObj[date] = tempObj[date].concat(arr);
            }
        }
    });

    if (req.params.chartType === "bar") {
        _.forEach(Object.keys(tempObj), (key) => {
            const obj = tempObj[key];
            let sum = 0;

            _.forEach(obj, (bill) => {
                sum += bill.amount;
            });

            returnObj[key] = sum;
        });

        const returnArr = commonUtils.sortBarChartData(returnObj, req);
        return req.params.skipSort === true ? returnObj : returnArr;
    } else {
        const key = Object.keys(tempObj)[0];

        returnObj.insights = {};
        returnObj.date = key;

        _.forEach(tempObj[key], (bill) => {
            returnObj.insights[bill.name] = bill.amount;
        });

        const returnArr = commonUtils.sortPieChartData(returnObj);
        return req.params.skipSort === true ? returnObj : returnArr;
    }
}

function getReturnJson(showPaychecks, req, bills) {
    let ret;
    let billAvg;
    let incomeAvg;

    if (
        showPaychecks &&
        req.params.type === "all" &&
        req.params.chartType === "bar"
    ) {
        req.params.showPaychecks = true;

        let paychecks = getRecurringPayments(req);
        paychecks = commonUtils.sortBarChartData(paychecks, req);

        const incomeAndBills = mergeIncomeAndBills(paychecks, bills);

        ret = incomeAndBills;

        const numDates = incomeAndBills.dataSet.length;

        billAvg = getAvg(incomeAndBills.dataSet, "billAmount", numDates) * -1;
        incomeAvg = getAvg(incomeAndBills.dataSet, "incomeAmount", numDates);
    } else {
        billAvg =
            req.params.chartType === "bar"
                ? getAvg(bills, "amount", bills.length)
                : _.sumBy(bills, "value");
        ret = {
            dataSet: bills,
        };
    }

    ret.avgs = {
        billAvg: billAvg,
        incomeAvg: incomeAvg,
        diffAvg: incomeAvg - billAvg,
    };

    return ret;
}

function getAvg(dataset, it, numDates) {
    return _.sumBy(dataset, it) / numDates;
}

function mergeIncomeAndBills(income, bills) {
    const chartObj = {
        dataSet: [],
        chartSettings: [
            { dataKey: "incomeAmount", label: "Income" },
            { dataKey: "billAmount", label: "Bills" },
            { dataKey: "difference", label: "Difference" },
        ],
    };

    _.forEach(income, (paycheck, i) => {
        const bill = bills[i];
        chartObj.dataSet.push({
            date: bill.date,
            billAmount: bill.amount * -1,
            incomeAmount: paycheck.amount * -1,
            difference: paycheck.amount * -1 - bill.amount,
        });
    });

    return chartObj;
}

module.exports.getRecurringPayments = getRecurringPayments;
module.exports.getReturnJson = getReturnJson;
module.exports.mergeIncomeAndBills = mergeIncomeAndBills;

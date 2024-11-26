const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");
const ccFileUtils = require("./utils/ccFileUtils");
const env = require("../env");

function getCCOverallPurchases(req) {
    const purchases = {};

    const ccPurchases = getPurchases(req, bankFileUtils.bankFileAnalysis);

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total * -1;
    });

    return commonUtils.sortBarChartData(purchases, req);
}

function getCCInsightPurchases(req) {
    const purchases = getPurchases(req, ccFileUtils.ccFileAnalysis);
    const retObj = {
        chartData: null,
        date: null,
    };

    let tempObj = null;

    _.forEach(purchases, (purchase) => {
        if (_.size(purchase.insights)) {
            const insights = {};
            _.forEach(Object.keys(purchase.insights), (key) => {
                const amount = purchase.insights[key] * -1;
                const newName = commonUtils.findNewName(key);

                if (insights[newName]) {
                    insights[newName] += amount;
                } else {
                    insights[newName] = amount;
                }
            });

            if (tempObj) {
                _.forEach(Object.keys(insights), (key) => {
                    const amount = insights[key];
                    if (tempObj.insights[key]) {
                        tempObj.insights[key] += amount;
                    } else {
                        tempObj.insights[key] = amount;
                    }
                });
            } else {
                tempObj = tempObj || { insights: insights };
                retObj.date = purchase.date;
            }
        }
    });

    if (!tempObj) {
        return null;
    }

    retObj.chartData = commonUtils.sortPieChartData(tempObj);

    return retObj;
}

function getPurchases(req, analysisFunc) {
    const ccExcludes = env.vars["CC_EXCLUDE"];
    const ccFolderContents = commonUtils.iterateBankFolder("CC_CSV_LOCATION");
    let ccPurchases = commonUtils.iterateFilesInFolder(
        ccFolderContents.fileNames,
        ccFolderContents.folderPath,
        analysisFunc,
        req,
        "CC_CSV_PREFIX",
        commonUtils.ccFileNoPrefix,
        1,
        5,
        true,
        ccExcludes,
        true
    );

    if (req.params.insight) {
        req.params.specific = _.map(
            _.filter(env.vars.STORES, (store) =>
                store.toMatch.includes("TARGET")
            ),
            "newName"
        );

        req.params.specific = _.uniq(req.params.specific);
        req.params.specificMatch = {
            category: "Shopping",
            place: "Target",
        };

        // Sum up SC purchases
        const scExcludes = env.vars["SC_EXCLUDE"];
        const scFolderContents =
            commonUtils.iterateBankFolder("SC_CSV_LOCATION");
        const scPurchases = commonUtils.iterateFilesInFolder(
            scFolderContents.fileNames,
            scFolderContents.folderPath,
            analysisFunc,
            req,
            "SC_CSV_PREFIX",
            commonUtils.scAndSSFileNoPrefix,
            0,
            3,
            true,
            scExcludes,
            true
        );

        ccPurchases = ccPurchases.concat(scPurchases);
    }

    return ccPurchases;
}

module.exports.getCCOverallPurchases = getCCOverallPurchases;
module.exports.getCCInsightPurchases = getCCInsightPurchases;

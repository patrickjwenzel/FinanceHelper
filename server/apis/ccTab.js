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
    const arr = [];
    let tempObj = null;
    const retObj = {
        chartData: null,
        date: null,
    };

    console.log(purchases);
    _.forEach(purchases, (purchase) => {
        if (_.size(purchase.insights)) {
            _.forEach(Object.keys(purchase.insights), (key) => {
                purchase.insights[key] *= -1;
            });
            arr.push(purchase);

            tempObj = purchase;
            retObj.date = purchase.date;
        }
    });
    console.log(tempObj);
    retObj.chartData = commonUtils.sortPieChartData(tempObj, req);

    return retObj;
}

function getPurchases(req, analysisFunc) {
    const ccExcludes = env.vars["CC_EXCLUDE"];
    const ccFolderContents = commonUtils.iterateBankFolder("CC_CSV_LOCATION");
    const ccPurchases = commonUtils.iterateFilesInFolder(
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

    return ccPurchases;
}

module.exports.getCCOverallPurchases = getCCOverallPurchases;
module.exports.getCCInsightPurchases = getCCInsightPurchases;

const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");
const ccFileUtils = require("./utils/ccFileUtils");

function getCCOverallPurchases(req) {
    const purchases = {};

    const ccPurchases = getPurchases(req, bankFileUtils.bankFileAnalysis);

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total * -1;
    });

    return purchases;
}

function getCCInsightPurchases(req) {
    const purchases = getPurchases(req, ccFileUtils.ccFileAnalysis);
    const arr = [];

    _.forEach(purchases, (purchase) => {
        if (_.size(purchase.insights)) {
            _.forEach(Object.keys(purchase.insights), (key) => {
                purchase.insights[key] *= -1;
            });

            arr.push(purchase);
        }
    });

    return arr;
}

function getPurchases(req, analysisFunc) {
    const ccExcludes = commonUtils.getExcludes("CC_EXCLUDE");
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

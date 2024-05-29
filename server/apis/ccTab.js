const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");

function getCCOverallPurchases(req) {
    const purchases = {};

    // Sum up CC purchases
    const ccExcludes = commonUtils.getExcludes("CC_EXCLUDE");
    const ccFolderContents = bankFileUtils.iterateBankFolder("CC_CSV_LOCATION");
    const ccPurchases = commonUtils.iterateFilesInFolder(
        ccFolderContents.fileNames,
        ccFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "CC_CSV_PREFIX",
        commonUtils.ccFileNoPrefix,
        1,
        5,
        true,
        ccExcludes
    );

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total * -1;
    });

    return purchases;
}

module.exports.getCCOverallPurchases = getCCOverallPurchases;

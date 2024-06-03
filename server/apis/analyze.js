const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");

function mergeBanks(req) {
    const purchases = {};

    // Sum up CC purchases
    const ccExcludes = env.vars["CC_EXCLUDE"];
    const ccFolderContents = commonUtils.iterateBankFolder("CC_CSV_LOCATION");
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

    // Sum up SC purchases
    const scExcludes = env.vars["SC_EXCLUDE"];
    const scFolderContents = commonUtils.iterateBankFolder("SC_CSV_LOCATION");
    const scPurchases = commonUtils.iterateFilesInFolder(
        scFolderContents.fileNames,
        scFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SC_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        3,
        false,
        scExcludes
    );

    // Sum up SS purchases
    const ssExcludes = env.vars["SS_EXCLUDE"];
    const ssFolderContents = commonUtils.iterateBankFolder("SS_CSV_LOCATION");
    const ssPurchases = commonUtils.iterateFilesInFolder(
        ssFolderContents.fileNames,
        ssFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SS_CSV_PREFIX",
        commonUtils.scAndSSFileNoPrefix,
        0,
        3,
        false,
        ssExcludes
    );

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total;
    });

    _.forEach(scPurchases.concat(ssPurchases), (purchase) => {
        purchases[purchase.date] += purchase.total;
    });

    return purchases;
}

module.exports.mergeBanks = mergeBanks;

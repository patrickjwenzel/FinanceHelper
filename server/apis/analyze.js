const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");

function mergeBanks(req) {
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

    // Sum up SC purchases
    const scExcludes = commonUtils.getExcludes("SC_EXCLUDE");
    const scFolderContents = bankFileUtils.iterateBankFolder("SC_CSV_LOCATION");
    const scPurchases = commonUtils.iterateFilesInFolder(
        scFolderContents.fileNames,
        scFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SC_CSV_PREFIX",
        scAndSSFileNoPrefix,
        0,
        3,
        false,
        scExcludes
    );

    // Sum up SS purchases
    const ssExcludes = commonUtils.getExcludes("SS_EXCLUDE");
    const ssFolderContents = bankFileUtils.iterateBankFolder("SS_CSV_LOCATION");
    const ssPurchases = commonUtils.iterateFilesInFolder(
        ssFolderContents.fileNames,
        ssFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SS_CSV_PREFIX",
        scAndSSFileNoPrefix,
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

function scAndSSFileNoPrefix(prefix, file) {
    const splitName = file.split("-");
    const fileNoPrefix = `${splitName[3]}${splitName[4].substring(0, 2)}01`;

    return fileNoPrefix;
}

module.exports.mergeBanks = mergeBanks;

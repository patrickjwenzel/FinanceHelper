const _ = require("lodash");

const recurringFileUtils = require("./utils/recurringFileUtils");
const commonUtils = require("./utils/commonUtils");
const env = require("../env");

function getRecurringPayments(req) {
    // Sum up CC purchases
    const ccExcludes = env.vars["CC_EXCLUDE"];
    const ccFolderContents = commonUtils.iterateBankFolder("CC_CSV_LOCATION");
    const ccPurchases = commonUtils.iterateFilesInFolder(
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

    const purchases = ccPurchases.concat(scPurchases).concat(ssPurchases);
    const obj = {};

    _.forEach(purchases, (purchase) => {
        if (purchase.date) {
            const arr = [];

            _.forEach(Object.keys(purchase.insights), (key) => {
                arr.push({
                    name: key,
                    amount: purchase.insights[key] * -1,
                });
            });

            if (obj[purchase.date] === undefined) {
                obj[purchase.date] = arr;
            } else {
                obj[purchase.date] = obj[purchase.date].concat(arr);
            }
        }
    });

    return obj;
}

module.exports.getRecurringPayments = getRecurringPayments;

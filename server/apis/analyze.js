const _ = require("lodash");

const bankFileUtils = require("./utils/bankFileUtils");
const commonUtils = require("./utils/commonUtils");
const env = require("../env");

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

    const allPurchses = scPurchases.concat(ssPurchases).concat(ccPurchases);
    let storeSums = {};
    const isMonthly = req.params.period === "monthly";

    const ret = {
        chartData: commonUtils.sortBarChartData(purchases, req),
    };

    _.forEach(allPurchses, (purchase) => {
        if (!storeSums[purchase.date]) {
            storeSums[purchase.date] = {};
        }

        _.forEach(
            Object.keys(isMonthly ? purchase[purchase.date] : purchase),
            (key) => {
                if (!key.match(/date|total/)) {
                    if (storeSums[purchase.date][key]) {
                        storeSums[purchase.date][key] += isMonthly
                            ? purchase[purchase.date][key]
                            : purchase[key];
                    } else {
                        storeSums[purchase.date][key] = isMonthly
                            ? purchase[purchase.date][key]
                            : purchase[key];
                    }
                }
            }
        );
    });

    storeSums = _.map(Object.keys(storeSums), (key) => ({
        date: key,
        places: storeSums[key],
    }));
    storeSums = _.sortBy(storeSums, "date");

    ret.storeSums = storeSums;

    return ret;
}

module.exports.mergeBanks = mergeBanks;

const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const bankFileUtils = require("./bankFileUtils");

function mergeFiles(req) {
    const purchases = {};

    // Sum up CC purchases
    const ccFolderContents = bankFileUtils.iterateBankFolder("CC_CSV_LOCATION");
    const ccPurchases = iterateFilesInFolder(
        ccFolderContents.fileNames,
        ccFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "CC_CSV_PREFIX",
        ccFileNoPrefix,
        1,
        4,
        5,
        true,
        ["Payment"]
    );

    // Sum up SC purchases
    const scFolderContents = bankFileUtils.iterateBankFolder("SC_CSV_LOCATION");
    const scPurchases = iterateFilesInFolder(
        scFolderContents.fileNames,
        scFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SC_CSV_PREFIX",
        scAndSSFileNoPrefix,
        0,
        2,
        3,
        false,
        ["Withdrawal"]
    );

    // Sum up SS purchases
    const ssFolderContents = bankFileUtils.iterateBankFolder("SS_CSV_LOCATION");
    const ssPurchases = iterateFilesInFolder(
        ssFolderContents.fileNames,
        ssFolderContents.folderPath,
        bankFileUtils.bankFileAnalysis,
        req,
        "SS_CSV_PREFIX",
        scAndSSFileNoPrefix,
        0,
        2,
        3,
        false,
        ["Deposit", "Withdrawal"]
    );

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total;
    });

    _.forEach(scPurchases.concat(ssPurchases), (purchase) => {
        purchases[purchase.date] += purchase.total;
    });

    return purchases;
}

function iterateFilesInFolder(
    files,
    folder,
    fileIterator,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    typeIndex,
    amountIndex,
    shouldSplit,
    excludes
) {
    const purchases = [];

    _.forEach(files, (file) => {
        const filePath = path.join(folder, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");

        const totals = fileIterator(
            file,
            fileContents,
            req,
            prefix,
            noPrefixFunc,
            dateIndex,
            typeIndex,
            amountIndex,
            shouldSplit,
            excludes
        );

        if (totals) {
            if (req.params.period === "monthly") {
                purchases.push(totals);
            } else {
                _.forEach(totals, (total) => {
                    purchases.push(total);
                });
            }
        }
    });

    return purchases;
}

function ccFileNoPrefix(prefix, file) {
    const regex = new RegExp(`${process.env[prefix]}|.CSV`);
    const fileNoPrefix = file.replace(regex, "").substring(0, 8);

    return fileNoPrefix;
}

function scAndSSFileNoPrefix(prefix, file) {
    const splitName = file.split("-");
    const fileNoPrefix = `${splitName[3]}${splitName[4].substring(0, 2)}01`;

    return fileNoPrefix;
}

function roundFloat(num) {
    return (Math.round((num + Number.EPSILON) * 100) / 100) * -1;
}

module.exports.mergeFiles = mergeFiles;
module.exports.roundFloat = roundFloat;

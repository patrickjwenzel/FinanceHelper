const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const ccFileUtils = require("./ccFileUtils");

function mergeFiles(req) {
    const purchases = {};

    // Sum up monthly CC purchases
    const ccFolderContents = ccFileUtils.iterateCCFolder();
    const ccPurchases = iterateFilesInFolder(
        ccFolderContents.fileNames,
        ccFolderContents.folderPath,
        ccFileUtils.ccFileAnalysis,
        req
    );

    _.forEach(ccPurchases, (purchase) => {
        purchases[purchase.date] = purchase.total;
    });

    return purchases;
}

function iterateFilesInFolder(files, folder, fileIterator, req) {
    const purchases = [];

    _.forEach(files, (file) => {
        const filePath = path.join(folder, file);
        const fileContents = fs.readFileSync(filePath, "utf-8");

        const totals = fileIterator(file, fileContents, req);

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

function roundFloat(num) {
    return (Math.round((num + Number.EPSILON) * 100) / 100) * -1;
}

module.exports.mergeFiles = mergeFiles;
module.exports.roundFloat = roundFloat;

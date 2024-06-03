const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const env = require("../../env");

function iterateFilesInFolder(
    files,
    folder,
    fileIterator,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    amountIndex,
    shouldSplit,
    excludes,
    isInsight = false
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
            amountIndex,
            shouldSplit,
            excludes
        );

        if (totals) {
            if (req.params.period === "monthly" || isInsight) {
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
    const regex = new RegExp(`${env.vars[prefix]}|.CSV`);
    const fileNoPrefix = file.replace(regex, "").substring(0, 8);

    return fileNoPrefix;
}

function iterateBankFolder(location) {
    const bankFolder = path.join(env.vars[location]);
    const bankFiles = fs.readdirSync(bankFolder);

    return {
        folderPath: bankFolder,
        fileNames: bankFiles,
    };
}

function scAndSSFileNoPrefix(prefix, file) {
    const splitName = file.split("-");
    const fileNoPrefix = `${splitName[3]}${splitName[4].substring(0, 2)}01`;

    return fileNoPrefix;
}

module.exports.iterateFilesInFolder = iterateFilesInFolder;
module.exports.ccFileNoPrefix = ccFileNoPrefix;
module.exports.iterateBankFolder = iterateBankFolder;
module.exports.scAndSSFileNoPrefix = scAndSSFileNoPrefix;

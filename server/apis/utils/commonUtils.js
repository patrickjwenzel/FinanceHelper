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

function getExcludes(key) {
    const excludes = [];

    const splitExcludes = env.vars[key].split(";");

    for (let i = 0; i <= splitExcludes.length - 2; i += 2) {
        excludes.push({
            index: Number(splitExcludes[i]),
            value: splitExcludes[i + 1],
        });
    }

    return excludes;
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

module.exports.iterateFilesInFolder = iterateFilesInFolder;
module.exports.getExcludes = getExcludes;
module.exports.ccFileNoPrefix = ccFileNoPrefix;
module.exports.iterateBankFolder = iterateBankFolder;

const fs = require("fs");
const _ = require("lodash");
const path = require("path");

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

function getExcludes(key) {
    const excludes = [];

    const splitExcludes = process.env[key].split(";");

    for (let i = 0; i <= splitExcludes.length - 2; i += 2) {
        excludes.push({
            index: Number(splitExcludes[i]),
            value: splitExcludes[i + 1],
        });
    }

    return excludes;
}

function ccFileNoPrefix(prefix, file) {
    const regex = new RegExp(`${process.env[prefix]}|.CSV`);
    const fileNoPrefix = file.replace(regex, "").substring(0, 8);

    return fileNoPrefix;
}

module.exports.iterateFilesInFolder = iterateFilesInFolder;
module.exports.getExcludes = getExcludes;
module.exports.ccFileNoPrefix = ccFileNoPrefix;

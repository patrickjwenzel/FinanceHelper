const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const moment = require("moment");

const bankFileUtils = require("./bankFileUtils");

function iterateCCFolder(location) {
    const bankFolder = path.join(process.env[location]);
    const bankFiles = fs.readdirSync(bankFolder);

    return {
        folderPath: bankFolder,
        fileNames: bankFiles,
    };
}

function ccFileAnalysis(
    file,
    lines,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    amountIndex,
    shouldSplit,
    excludes
) {
    const fileNoPrefix = noPrefixFunc(prefix, file);
    const sum = {};
    const isMonthly = req.params.period === "monthly";
    const of = isMonthly ? "month" : "week";
    const shouldIterate = bankFileUtils.shouldPass(req, fileNoPrefix, "month");

    if (shouldIterate) {
        sum.insights = {};
        let splitLines = lines.split("\n");
        splitLines.shift();
        splitLines.pop();

        _.forEach(splitLines, (line) => {
            const splitLine = line.split(",");
            if (
                bankFileUtils.shouldBeIncluded(splitLine, excludes, amountIndex)
            ) {
                let date = splitLine[dateIndex].split("/");
                date = `${date[2]}-${date[0]}-${date[1]}`;

                date = shouldSplit ? date : splitLine[dateIndex];

                const shouldAdd = bankFileUtils.shouldPass(req, date, of);

                if (shouldAdd) {
                    const startOf = moment(date)
                        .startOf(of)
                        .format("YYYY-MM-DD");

                    let total = parseFloat(splitLine[amountIndex]);
                    total = Boolean(total)
                        ? total
                        : parseFloat(splitLine[amountIndex + 1]);

                    sum.date = startOf;

                    const index = req.params.insight === "category" ? 3 : 2;
                    const insight = splitLine[index];

                    if (sum.insights[insight] === undefined) {
                        sum.insights[insight] = total;
                    } else {
                        sum.insights[insight] += total;
                    }
                }
            }
        });
    }

    return sum;
}

module.exports.iterateCCFolder = iterateCCFolder;
module.exports.ccFileAnalysis = ccFileAnalysis;

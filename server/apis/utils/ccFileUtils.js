const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const moment = require("moment");

const fileUtils = require("./fileUtils");

function iterateCCFolder() {
    const ccFolder = path.join(process.env.CC_CSV_LOCATION);
    const ccFiles = fs.readdirSync(ccFolder);

    return {
        folderPath: ccFolder,
        fileNames: ccFiles,
    };
}

function ccFileAnalysis(file, lines, req) {
    const regex = new RegExp(`${process.env.CC_CSV_PREFIX}|.CSV`);
    const fileNoPrefix = file.replace(regex, "").substring(0, 8);
    const sum = {};
    const isMonthly = req.params.period === "monthly";
    const shouldIterate = shouldPass(req, fileNoPrefix, "month");

    if (isMonthly) {
        sum.date = moment(fileNoPrefix).format("MM/YYYY");
        sum.total = 0;
    }

    if (shouldIterate) {
        let splitLines = lines.split("\n");
        splitLines.shift();
        splitLines.pop();

        _.forEach(splitLines, (line) => {
            const splitLine = line.split(",");
            if (splitLine[4] !== "Payment") {
                const total = parseFloat(splitLine[5]);
                if (isMonthly) {
                    sum.total += total;
                } else {
                    let date = splitLine[1].split("/");
                    date = `${date[2]}-${date[0]}-${date[1]}`;

                    const shouldAdd = shouldPass(req, date, "week");

                    if (shouldAdd) {
                        const week = moment(date)
                            .startOf("week")
                            .format("YYYY-MM-DD");
                        if (sum[week]) {
                            sum[week] += total;
                        } else {
                            sum[week] = total;
                        }
                    }
                }
            }
        });

        if (isMonthly) {
            sum.date = moment(fileNoPrefix).format("MM/YYYY");
            sum.total = fileUtils.roundFloat(sum.total);
            return sum;
        } else {
            const arr = [];
            _.forEach(Object.keys(sum), (key) => {
                arr.push({
                    date: key,
                    total: fileUtils.roundFloat(sum[key]),
                });
            });

            return arr;
        }
    }
}

function shouldPass(req, toCompare, of) {
    let shouldPass = true;
    if (req.params.min) {
        shouldPass = shouldPass && isGTMin(toCompare, req.params.min, of);
    }

    if (req.params.max) {
        shouldPass = shouldPass && isLTMax(toCompare, req.params.max, of, true);
    }

    return shouldPass;
}

function isGTMin(toCompare, min, startOf) {
    const minDate = moment(min).startOf(startOf);
    const diff = moment(toCompare).diff(minDate, "days");
    return diff >= 0;
}
function isLTMax(toCompare, max, endOf, isMonthly = false) {
    const maxDate = moment(max).endOf(endOf);
    const diff = moment(toCompare).diff(maxDate, "days");
    return isMonthly ? diff < 0 : diff <= 0;
}

module.exports.iterateCCFolder = iterateCCFolder;
module.exports.ccFileAnalysis = ccFileAnalysis;

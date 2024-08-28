const _ = require("lodash");
const moment = require("moment");
const commonUtils = require("./commonUtils");

function bankFileAnalysis(
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
    const sum = { total: 0 };
    const isMonthly = req.params.period === "monthly";
    const shouldIterate = shouldPass(req, fileNoPrefix, "month");
    const gettingBalances = _.isEmpty(excludes);
    const fileDate = moment(fileNoPrefix).format("MM/YYYY");

    if (isMonthly) {
        sum[fileDate] = {};
    }

    if (shouldIterate) {
        let splitLines = lines.split("\n");
        splitLines.shift();
        splitLines.pop();

        const linesToIterate = gettingBalances
            ? splitLines.reverse()
            : splitLines;

        _.forEach(linesToIterate, (line) => {
            const splitLine = line.split(",");
            if (shouldBeIncluded(splitLine, excludes, amountIndex)) {
                let shouldAdd = true;
                let total = parseFloat(splitLine[amountIndex]);
                total = Boolean(total)
                    ? total
                    : parseFloat(splitLine[amountIndex + 1]);

                if (gettingBalances) {
                    total = Boolean(parseFloat(splitLine[amountIndex - 1]))
                        ? total
                        : parseFloat(splitLine[amountIndex + 1]);
                }

                if (isMonthly) {
                    if (gettingBalances) {
                        sum.total = total;
                    } else {
                        const newName = commonUtils.findNewName(
                            splitLine[dateIndex + 1]
                        );

                        sum.total += total;
                        if (sum[fileDate][newName]) {
                            sum[fileDate][newName] += total;
                        } else {
                            sum[fileDate][newName] = total;
                        }
                    }
                } else {
                    let date = commonUtils.getDate(splitLine, dateIndex);
                    const of = "week";

                    shouldAdd = shouldPass(req, date, of);

                    if (shouldAdd) {
                        date = moment(date).startOf(of).format("YYYY-MM-DD");
                        if (gettingBalances) {
                            sum[date] = total;
                        } else {
                            if (sum[date]) {
                                sum[date].total += total;
                            } else {
                                sum[date] = { total: total };
                            }

                            const newName = commonUtils.findNewName(
                                splitLine[dateIndex + 1]
                            );

                            if (sum[date][newName]) {
                                sum[date][newName] += total;
                            } else {
                                sum[date][newName] = total;
                            }
                        }
                    }
                }
            }
        });

        if (isMonthly) {
            sum.date = fileDate;
            sum.total = sum.total;
            return sum;
        } else {
            const arr = [];
            _.forEach(Object.keys(sum), (key) => {
                if (key !== "total") {
                    const d1 = moment(fileNoPrefix);
                    const d2 = moment(key);

                    if (d2.diff(d1) >= 0) {
                        arr.push({
                            date: key,
                            ...sum[key],
                        });
                    }
                }
            });

            return arr;
        }
    }
}

function shouldPass(req, toCompare, of) {
    let shouldPass = true;

    req.params.min = req.params.date
        ? moment(req.params.date).startOf(of)
        : req.params.min;

    req.params.max = req.params.date
        ? moment(req.params.date).endOf(of)
        : req.params.max;

    if (req.params.min) {
        shouldPass = shouldPass && isGTMin(toCompare, req.params.min, of);
    }

    if (req.params.max) {
        shouldPass = shouldPass && isLTMax(toCompare, req.params.max, of);
    }

    return shouldPass;
}

function isGTMin(toCompare, min, startOf) {
    const minDate = moment(min).startOf(startOf);
    const diff = moment(toCompare).diff(minDate, "days");
    return diff >= 0;
}
function isLTMax(toCompare, max, endOf) {
    const maxDate = moment(max).endOf(endOf);
    const diff = moment(toCompare).diff(maxDate, "days");
    return diff <= 0;
}

function shouldBeIncluded(line, excludes, amountIndex) {
    let include = true;

    _.forEach(excludes, (el) => {
        const total = parseFloat(line[amountIndex]);
        const index = Boolean(total) ? el.index : el.index + 1;
        if (line[index] === el.value) {
            include = false;
        }
    });

    return include;
}

module.exports.bankFileAnalysis = bankFileAnalysis;
module.exports.shouldBeIncluded = shouldBeIncluded;
module.exports.shouldPass = shouldPass;

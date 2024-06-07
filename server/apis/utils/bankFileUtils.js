const _ = require("lodash");
const moment = require("moment");

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
    const sum = {};
    const isMonthly = req.params.period === "monthly";
    const shouldIterate = shouldPass(req, fileNoPrefix, "month");
    const gettingBalances = _.isEmpty(excludes);

    if (isMonthly) {
        sum.date = moment(fileNoPrefix).format("MM/YYYY");
        sum.total = 0;
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
                        sum.total += total;
                    }
                } else {
                    let date = splitLine[dateIndex];

                    if (shouldSplit) {
                        date = date.split("/");
                        date =
                            `${date[2]}-${padNumber(date[0])}` +
                            `-${padNumber(date[1])}`;
                    }

                    const of = req.params.period === "weekly" ? "week" : "day";

                    const shouldAdd = shouldPass(req, date, of);

                    if (shouldAdd) {
                        date = moment(date).startOf(of).format("YYYY-MM-DD");
                        if (sum[date] && !gettingBalances) {
                            sum[date] += total;
                        } else {
                            sum[date] = total;
                        }
                    }
                }
            }
        });

        if (isMonthly) {
            sum.date = moment(fileNoPrefix).format("MM/YYYY");
            sum.total = sum.total;
            return sum;
        } else {
            const arr = [];
            _.forEach(Object.keys(sum), (key) => {
                const d1 = moment(fileNoPrefix);
                const d2 = moment(key);

                if (d2.diff(d1) >= 0) {
                    arr.push({
                        date: key,
                        total: sum[key],
                    });
                }
            });

            return arr;
        }
    }
}

function padNumber(num) {
    let newNum = Number(num);

    return `${newNum < 10 && num.length === 1 ? "0" : ""}${num}`;
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

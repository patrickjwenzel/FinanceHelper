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
            if (shouldBeIncluded(splitLine, excludes, amountIndex)) {
                let total = parseFloat(splitLine[amountIndex]);
                total = Boolean(total)
                    ? total
                    : parseFloat(splitLine[amountIndex + 1]);
                if (isMonthly) {
                    sum.total += total;
                } else {
                    let date = splitLine[dateIndex];

                    if (shouldSplit) {
                        date = date.split("/");
                        date =
                            `${date[2]}-${padNumber(date[0])}` +
                            `-${padNumber(date[1])}`;
                    }

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
            sum.total = sum.total;
            return sum;
        } else {
            const arr = [];
            _.forEach(Object.keys(sum), (key) => {
                arr.push({
                    date: key,
                    total: sum[key],
                });
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

const _ = require("lodash");
const moment = require("moment");

const bankFileUtils = require("./bankFileUtils");
const env = require("../../env");

function bankFileAnalysisRecurring(
    file,
    lines,
    req,
    prefix,
    noPrefixFunc,
    dateIndex,
    amountIndex,
    shouldSplit,
    excludes,
    nameIndex,
    recurType
) {
    const fileNoPrefix = noPrefixFunc(prefix, file);
    const sum = {};
    const of = "month";
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

                const shouldAddDate = bankFileUtils.shouldPass(req, date, of);

                let lineName = splitLine[nameIndex];
                let name = env.vars[recurType][lineName];
                let shouldAddPeackock = false;

                const shouldAddName = Boolean(name);

                if (recurType === "SUBSCRIPTIONS") {
                    lineName = lineName.split(" ");
                    if (lineName.length === 3) {
                        const newName = `${lineName.shift()} ${lineName.pop()}`;
                        shouldAddPeackock = Boolean(
                            env.vars[recurType][newName]
                        );

                        name = shouldAddPeackock
                            ? env.vars[recurType][newName]
                            : name;
                    }
                }

                if (shouldAddDate && (shouldAddName || shouldAddPeackock)) {
                    const startOf = moment(date).startOf(of).format("YYYY-MM");

                    let total = parseFloat(splitLine[amountIndex]);
                    total = Boolean(total)
                        ? total
                        : parseFloat(splitLine[amountIndex + 1]);

                    sum.date = startOf;

                    if (sum.insights[name] === undefined) {
                        sum.insights[name] = total;
                    } else {
                        sum.insights[name] += total;
                    }
                }
            }
        });
    }

    return sum;
}

module.exports.bankFileAnalysisRecurring = bankFileAnalysisRecurring;

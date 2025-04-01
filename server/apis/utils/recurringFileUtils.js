const _ = require("lodash");
const moment = require("moment");

const bankFileUtils = require("./bankFileUtils");
const commonUtils = require("./commonUtils");
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
    const shouldIterate = bankFileUtils.shouldPass(
        req,
        fileNoPrefix,
        "month",
        true
    );
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
                const date = commonUtils.getDate(
                    splitLine,
                    dateIndex,
                    shouldSplit
                );
                const shouldAddDate = bankFileUtils.shouldPass(
                    req,
                    date,
                    of,
                    true
                );

                let lineName = splitLine[nameIndex];
                let name =
                    recurType === "ALL"
                        ? env.vars.SUBSCRIPTIONS[lineName] ||
                          env.vars.UTILITIES[lineName]
                        : env.vars[recurType]?.[lineName];

                let shouldAddPeackock = false;
                const shouldAddPaycheck =
                    req.params.showPaychecks &&
                    _.includes(env.vars.PAYCHECKS["primary"], lineName);

                const isValidName = Boolean(name);

                if (
                    recurType === "SUBSCRIPTIONS" &&
                    !req.params.showPaychecks
                ) {
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

                if (shouldAddPaycheck && !name) {
                    name = lineName;
                }

                const shouldAddName = req.params.showPaychecks
                    ? isValidPaycheck("primary", lineName) ||
                      (req.params.includeSecondary &&
                          isValidPaycheck("secondary", lineName))
                    : isValidName || shouldAddPeackock;

                if (shouldAddDate && shouldAddName) {
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

function isValidPaycheck(type, lineName) {
    return _.includes(env.vars.PAYCHECKS[type], lineName);
}

module.exports.bankFileAnalysisRecurring = bankFileAnalysisRecurring;

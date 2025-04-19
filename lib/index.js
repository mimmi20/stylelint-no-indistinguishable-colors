import stylelint from 'stylelint';
import postcss from 'postcss';
import colorguard from 'postcss-colorguard';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const isValidHex = (text) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(text);

const ruleName = 'plugin/stylelint-no-indistinguishable-colors';
const messages = ruleMessages(ruleName, {
  rejected: (a, b) => `Unexpected indistinguishable colors "${a}" and "${b}".`,
});

/** @type {import('stylelint').Rule} */
const rule = function (primaryOption, secondaryOptions) {
  return function (postcssRoot, postcssResult) {
    const validOptions = validateOptions(
      postcssResult,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        optional: true,
        actual: secondaryOptions,
        possible: {
          ignore: isValidHex,
          threshold: (x) => Number.isInteger(x) && x >= 0 && x <= 100,
          whitelist: (x) => Array.isArray(x) && x.every(isValidHex),
          allowEquivalentNotation: [true, false],
        },
      }
    );

    if (!validOptions) {
      return;
    }

    if (!primaryOption) {
      return;
    }

    postcssRoot.walkRules((node) => {
      const res = postcss([colorguard(secondaryOptions)]).process(node);

      res.warnings().forEach((colorguardWarning) => {
        report({
          message: messages.rejected(colorguardWarning.secondColor, colorguardWarning.firstColor),
          node: colorguardWarning.node,
          result: postcssResult,
          ruleName: ruleName,
        });
      });
    });
    postcssRoot.walkAtRules((node) => {
      const res = postcss([colorguard(secondaryOptions)]).process(node);

      res.warnings().forEach((colorguardWarning) => {
        report({
          message: messages.rejected(colorguardWarning.secondColor, colorguardWarning.firstColor),
          node: node,
          result: postcssResult,
          ruleName: ruleName,
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);

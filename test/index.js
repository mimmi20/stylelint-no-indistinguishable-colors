import plugin from '../lib/index.js';
import { testRule } from 'stylelint-test-rule-node';

const plugins = [plugin];

testRule({
  ruleName: plugin.ruleName,
  config: [true],
  plugins: plugins,

  reject: [
    {
      code: 'div { color: #000; background: #010101; }',
      description: 'should enable rule',
      message: plugin.rule.messages.rejected('#010101', '#000'),
      column: 20,
      endColumn: 40,
      endLine: 1,
      line: 1,
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [null],
  plugins: plugins,

  accept: [
    {
      code: 'div { color: #000; background: #010101; }',
      description: 'should disable rule',
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { ignore: ['#000', '#010101'] }],
  plugins: plugins,

  accept: [
    {
      code: 'div { color: #000; border: 1px solid #010101; background: #111 }',
      description: 'should ignore selected colors',
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { threshold: 10 }],
  plugins: plugins,

  reject: [
    {
      code: 'div { color: #000; background: #222; }',
      description: 'should set higher threshold',
      message: plugin.rule.messages.rejected('#222', '#000'),
      column: 20,
      endColumn: 37,
      endLine: 1,
      line: 1,
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { threshold: 1 }],
  plugins: plugins,

  accept: [
    {
      code: 'div { color: #000; background: #222; }',
      description: 'should set lower threshold',
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [
    true,
    {
      whitelist: [
        ['#000', '#010101'],
        ['#eee', '#ddd'],
      ],
    },
  ],
  plugins: plugins,

  accept: [
    {
      code: 'div { color: #000; color: #010101; border: 1px solid #ddd; background: #eee }',
      description: 'should ignore selected color pairs',
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { allowEquivalentNotation: false }],
  plugins: plugins,

  reject: [
    {
      code: 'div { color: #000; background: black; border: 1px solid rgb(0,0,0); }',
      description: 'should disable equivalent notation',

      warnings: [
        {
          message: plugin.rule.messages.rejected('black', '#000'),
          column: 20,
          endColumn: 38,
          endLine: 1,
          line: 1,
        },
        {
          message: plugin.rule.messages.rejected('rgb(0,0,0)', '#000'),
          column: 39,
          endColumn: 68,
          endLine: 1,
          line: 1,
        },
        {
          message: plugin.rule.messages.rejected('rgb(0,0,0)', 'black'),
          column: 39,
          endColumn: 68,
          endLine: 1,
          line: 1,
        },
      ],
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { allowEquivalentNotation: true }],
  plugins: plugins,

  accept: [
    {
      code: 'div { color: #000; background: black; border: 1px solid rgb(0,0,0); }',
      description: 'should enable equivalent notation',
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { not_exists: true }],
  plugins: plugins,

  reject: [
    {
      code: 'div {}',
      description: 'should display error on incorrect options',
      message: 'Invalid option name "not_exists" for rule "plugin/stylelint-no-indistinguishable-colors"',
      column: 20,
      endColumn: 37,
      endLine: 1,
      line: 1,
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true, { allowEquivalentNotation: ['#eee'] }],
  plugins: plugins,

  reject: [
    {
      code: 'div {}',
      description: 'should display error on incorrect arguments',
      message: 'Invalid value "#eee" for option "allowEquivalentNotation" of rule "plugin/stylelint-no-indistinguishable-colors"',
      column: 20,
      endColumn: 37,
      endLine: 1,
      line: 1,
    },
  ],
});

testRule({
  ruleName: plugin.ruleName,
  config: [true],
  plugins: plugins,

  accept: [
    {
      code: 'div { background: #fff; font-family: "Arial Black"; }',
      description: 'should ignore color names in font-family',
    },
  ],
});

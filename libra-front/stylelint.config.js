module.exports = {
  defaultSeverity: 'warning',
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-sass-guidelines',
  ],
  rules: {
    'scss/selector-no-union-class-name': true,
    'order/properties-alphabetical-order': true,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'blockless-after-same-name-blockless'],
        ignoreAtRules: ['else'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['value'],
      },
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested', 'after-comment'],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        severity: 'warning',
      },
    ],
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested', 'after-comment'],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['global'],
      },
    ],
    'max-nesting-depth': [
      3,
      {
        ignore: ['pseudo-classes', 'blockless-at-rules'],
      },
    ],
    'no-descending-specificity': [
      true,
      {
        severity: 'error',
        ignore: ['selectors-within-list'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [],
        ignoreSelectors: [':export', '/^:import/'],
      },
    ],
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'scss/at-mixin-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        severity: 'warning',
        message: "mixin name should use 'lowerCamelCase' notation",
      },
    ],
    'scss/dollar-variable-colon-space-after': 'always-single-line',
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute', 'class'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'export',
          'import',
          'global',
          'local',
          'external',
        ],
      },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['from', 'period-row'],
      },
    ],
    'value-no-vendor-prefix': true,
    'declaration-no-important': true,
    'color-function-notation': null,
    'declaration-property-value-disallowed-list': null,
    'selector-max-compound-selectors': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'scss/at-mixin-argumentless-call-parentheses': null,
    'scss/operator-no-newline-after': null,
    'property-no-vendor-prefix': null,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      plugins: ['stylelint-scss'],
      rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['value'],
          },
        ],
        'function-no-unknown': null,
        'scss/function-no-unknown': [
          true,
          {
            ignoreFunctions: ['global'],
          },
        ],
      },
    },
  ],
};

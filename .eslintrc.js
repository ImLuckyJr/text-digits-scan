module.exports = {
	root:          true,
	parserOptions: {
		parser:     'babel-eslint',
		sourceType: 'module'
	},
	extends:       [
		// 'airbnb-base',
		'plugin:vue/recommended',
		'standard'
		// 'prettier',
		// 'prettier/standard',
		// 'prettier/vue'
	],
	plugins:       [
		// 'prettier',
		'vue'
	],
	rules:         {
		'indent': 'off',
		// 'quotes': [ 'error', 'single' ],
		// 'semi':   [ 'error', 'always' ],

		'no-debugger':     'error',
		// 'no-console':      'error',
		'prefer-template': 'off',

		'max-lines':              [ 'warn', 600 ],
		'max-lines-per-function': [ 'warn', 180 ],
		'complexity':             [ 'warn', 15 ],
		'max-nested-callbacks':   [ 'error', { max: 3 } ],

		'operator-assignment':               'off',
		'no-irregular-whitespace':           'off',
		'no-param-reassign':                 'off',
		'prefer-destructuring':              'off',
		'import/no-extraneous-dependencies': 'off',
		'no-continue':                       'off',
		'no-shadow':                         'off',
		'no-new':                            'off',
		'no-tabs':                           'off',
		'no-await-in-loop':                  'off',
		'no-bitwise':                        'off',
		'global-require':                    'off',
		'vue/no-boolean-default':            'off',
		'import/no-dynamic-require':         'off',

		'object-curly-spacing':      'error',
		'computed-property-spacing': 'error',

		// 'vue/array-bracket-spacing':                  'error',
		'vue/arrow-spacing':                           'error',
		'vue/block-spacing':                           'error',
		'vue/brace-style':                             'error',
		'vue/camelcase':                               'error',
		// 'vue/comma-dangle':                           [ 'error', 'always-multiline' ],
		'vue/component-name-in-template-casing':       'error',
		'vue/eqeqeq':                                  [ 'error', 'smart' ],
		'vue/html-indent':                             'off',
		'vue/key-spacing':                             'error',
		'vue/html-quotes':                             'off',
		'vue/max-attributes-per-line':                 'off',
		'vue/html-closing-bracket-newline':            'off',
		'vue/script-indent':                           'off',
		'no-trailing-spaces':                          'off',
		'no-mixed-spaces-and-tabs':                    'off',
		'comma-dangle':                                'off',
		'key-spacing':                                 'off',
		'vue/array-bracket-spacing':                   'off',
		'vue/html-closing-bracket-spacing':            'off',
		'vue/singleline-html-element-content-newline': 'off',
		'no-console':                                  'off',
		'semi':                                        'off',
		'vue/no-side-effects-in-computed-properties':  'off',
		'space-before-function-paren':                 'off',
		'vue/attribute-hyphenation':                   'off',
		'handle-callback-err':                         'off',
		'vue/html-self-closing':                       'off',
		'vue/no-unused-vars':                          'off',
		'no-unused-vars':                              'off',
		'no-undef':                                    'off',
		'vue/object-curly-spacing':                    [ 'error', 'always' ],
		'vue/space-infix-ops':                         'error',
		'vue/space-unary-ops':                         'error',
		'vue/v-on-function-call':                      'error',
		'operator-linebreak':                          [ 'error', 'before' ],
		'radix':                                       [ 'error', 'as-needed' ]
	},
	'overrides':   [
		{
			'files': [ '*.vue' ],
			'rules': {
				// 'indent': 'off'
			}
		}
	]
};

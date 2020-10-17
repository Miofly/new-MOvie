// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {},
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `share:vue/strongly-recommended` or `share:vue/recommended` for stricter rules.
        // 'share:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        // 使用off表示取消限制
        // allow async-await
        // 'generator-star-spacing': 'off',
        // allow debugger during development
        'indent': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "comma-dangle": 'off', // 禁止逗号的检测
        "object-curly-spacing": "off",
        // "quotes": [1, "double"], // 使用双引号
        // "no-extend-native": "off", // 关闭不允许使用原型扩展
        // "no-sparse-arrays": "off", // 禁止稀疏数组， [1,,2]
        "no-trailing-spaces": "off", // 允许有多余的空行
        "no-tabs": "off", // tab缩进问题
        "vue/no-parsing-error": [2, {"x-invalid-end-tag": false}],
        "no-callback-literal": "off",
        "camelcase": "off",
        "eqeqeq": "off"
    },
    globals: {
        uni: true, // 配置支持uni关键字
        wx: true, // 配置支持uni关键字
        ROUTES: true // 配置支持uni关键字
    },
}

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: "babel-eslint",
    },
    extends: [
        "@nuxtjs",
        "plugin:nuxt/recommended",
    ],
    plugins: [
    ],
    // add your custom rules here
    rules: {
        "vue/html-indent": ["error", 4, { baseIndent: 1 }],
        indent: ["error", 4],
        "eol-last": ["error", "never"],
        "comma-dangle": ["error", "always-multiline"], // Require trailing comma only when using multiline objects, arrays etc. See https://eslint.org/docs/2.0.0/rules/brace-style#stroustrup
        semi: ["error", "always"],
        quotes: [2, "double"], // Strings should be double quotes per guidelines.
        "brace-style": ["error", "1tbs"], // if else conditions will begin in a new line after curly braces. See https://eslint.org/docs/2.0.0/rules/brace-style#stroustrup
        "space-before-function-paren": ["error", "never"], // Disallow space before function. See https://eslint.org/docs/rules/space-before-function-paren#never
        "no-console": "off",
    },
    globals: {
        grecaptcha: "readonly",
        mixpanel: "readonly",
        jspdf: "readonly",
        html2pdf: "readonly",
        google: "readonly",
    },
    ignorePatterns: ["static/js/*.js"],
};
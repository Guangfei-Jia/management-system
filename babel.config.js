const plugins = [
  "@babel/plugin-transform-runtime" //减少babel，es6转译es5代码时，会有很多help函数，引入可以消除多余的help函数
];
if (['production', 'pro'].includes(process.env.NODE_ENV)) {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: plugins
};

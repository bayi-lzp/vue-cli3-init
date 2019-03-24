// 去除生产环境的consoles
const plugins = [];
if(['production', 'prod'].includes(process.env.NODE_ENV)) {
  plugins.push("transform-remove-console")
}
module.exports = {
  presets: [["@vue/app",{"useBuiltIns": "entry"}]],
  plugins: [
      plugins,
    [
      "component",
      {
        "libraryName": "mint-ui",
        "style": true
      }
    ]
  ]
};


module.exports = {
  presets: [["@vue/app",{"useBuiltIns": "entry"}]],
  plugins: [
      // plugins,
    [
      "component",
      {
        "libraryName": "mint-ui",
        "style": true
      }
    ]
  ]
};

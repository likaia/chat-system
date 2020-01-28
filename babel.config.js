module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "view-design",
        "libraryDirectory": "src/components"
      }
    ]
  ]
};

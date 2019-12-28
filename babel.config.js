module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "at",
        libraryDirectory: "src/components"
      }
    ]
  ]
};

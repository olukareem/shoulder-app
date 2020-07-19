const tailwindcss = require("tailwindcss");
module.exports = {
  theme: {
    textColor: {
      primary: "#85C0BE",
    },
  },
  plugins: [tailwindcss("./tailwind.js"), require("autoprefixer")],
};

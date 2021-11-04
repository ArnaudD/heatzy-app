const { snowWhite, darkBrown, mediumBrown } = require("./config/Colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "snow-white": snowWhite,
        "dark-brown": darkBrown,
        "medium-brown": mediumBrown,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        "elevation-1": {
          // shadowOffset: "1px 2px",
          // shadowRadius: 10,
          // shadowOpacity: 0.1,
          elevation: 1,
        },
        "elevation-2": {
          // shadowOffset: "1px 2px",
          // shadowRadius: 10,
          // shadowOpacity: 0.1,
          elevation: 2,
        },
      };

      addUtilities(utilities);
    },
  ],
};

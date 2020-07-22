import Vue from "vue";
import Vuetify from "vuetify/lib";
import ja from "vuetify/es5/locale/ja";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1F76DD",
        secondary: "#EDC32F",
        accent: "#04E3EC",
        neutral: "#113364",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
      },
    },
  },
  lang: {
    locales: { ja },
    current: "ja",
  },
});

const fs = require("fs");
module.exports = {
  input: ["build/tmp/**/*.{js,jsx}"],
  output: "./public/locales",
  options: {
    debug: true,
    func: {
      list: ["t", "i18n.t"],
      extensions: [".js", ".jsx"],
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      //   defaultsKey: "defaults",
      extensions: [".js", ".jsx"],
      acorn: {
        ecmaVersion: 2020,
        sourceType: "module", // defaults to 'module'
        // Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
      },
    },
    lngs: ["en", "ja", "zh", "ko"],
    ns: ["translation"],
    defaultLng: "en",
    defaultNs: "translation",
    // defaultValue: "__STRING_NOT_TRANSLATED__",
    resource: {
      loadPath: "{{lng}}/{{ns}}.json",
      savePath: "{{lng}}/{{ns}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
  },
  transform: function customTransform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    const dateDefaults = {
      "NO_TL.absoluteDate": "{{date, absolute}}",
      "NO_TL.longDate": "{{date, long}}",
      "NO_TL.relativeDate": "{{date, ago}}",
      "NO_TL.shortDate": "{{date, short}}",
      "NO_TL.shortDateTime": "{{date, datetime}}",
    };
    parser.parseFuncFromString(content, function (key, options) {
      if (dateDefaults[key]) {
        options.defaultValue = dateDefaults[key];
      } else {
        options.defaultValue = key; // use key as the value
      }
      parser.set(key, options);
    });
    done();
  },
};

import { Application } from "express";
import i18n from "i18n";

export default (app: Application) => {
  i18n.configure({
    locales: ["en"],
    defaultLocale: "en",
    cookie: "locale",
    directory: "public/locales",
    directoryPermissions: "755",
    autoReload: true,
    updateFiles: true,
    objectNotation: true,
    api: {
      __: "__", //now req.__ becomes req.__
      __n: "__n", //and req.__n can be called as req.__n
    },
  });

  app.use(i18n.init);
};

export const localize = i18n;

// import chalk from 'chalk'
// import i18next from 'i18next'
// import i18nextBackend from 'i18next-fs-backend'

// void i18next.use(i18nextBackend).init(
//   {
//     lng: 'en',
//     fallbackLng: 'en',
//     preload: ['en', 'id'],
//     ns: ['translation'],
//     defaultNS: 'translation',
//     backend: {
//       loadPath: 'public/locales/{{lng}}/{{ns}}.json',
//     },
//   },
//   (err, _t) => {
//     if (err) return console.error(err)

//     const name = chalk.cyan('i18next')
//     console.log(`${name} is ready...`)
//   }
// )

// export default i18next

import "./pathAlias";

import App from "./app";

// import validateEnv from '@utils/validateEnv';
// validateEnv();

const app = new App();

app.listen();

// import "./pathAlias";

// import App from "./app";

// const Server = new App();

// (async () => {
//   // // initial database
//   // db.sequelize
//   //   .authenticate()
//   //   .then(() => {
//   //     console.log(
//   //       `Connection ${chalk.cyan(dialect)} has been established successfully.`
//   //     )
//   //   })
//   //   .catch((err: any) => {
//   //     console.error('Unable to connect to the database: ', err)
//   //   })

//   // // initial jobs
//   // initialJobs()

//   Server.run();
// })();

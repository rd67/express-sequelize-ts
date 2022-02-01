import Sequelize from "sequelize";
import chalk from "chalk";

import config from "@config/config";

import { logger } from "@utils/logger";

const { host, username, password, database, dialect, pool } = config.db;

const sequelize = new Sequelize.Sequelize(database, username, password, {
  host,
  dialect,
  // timezone: '+09:00',
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: false,
    freezeTableName: true,
  },
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: !config.app.isProduction,
  logging: (query, time) => {
    logger.info(time + "ms" + " " + query);
  },
  benchmark: true,
});

sequelize
  .authenticate()
  .then(() => {
    const name = chalk.cyan("🌿Mysql Client");
    console.log(`${name} Connection has been established successfully.`);
  })
  .catch((error) => {
    // logger.error()
    console.log(`❌${chalk.red("Mysql Error:")} Something went wrong ${error}`);
  });

const DB = {
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;

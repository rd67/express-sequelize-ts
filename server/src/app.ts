import express, { Application } from "express";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import requestIp from "request-ip";
import UserAgent from "express-useragent";
import chalk from "chalk";
import fileUpload from "express-fileupload";

// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

import {
  RequestHandler,
  LatencyHandler,
  RouteNotFoundHandler,
  ErrorHandler,
  ReqRateLimiterHandler,
} from "@middlewares/index";
import i18n from "@utils/i18n";
import httpLogger from "@utils/httpLogger";
import mysql from "@utils/mysql";

import config from "@config/config";

import modules from "@modules/index";

import { associateModels } from "@models/index";

import queues from "@queues/index";

import { bootstrapApp } from "./bootstrap";
import socket from "@utils/socket";

const {
  app: { port, environment },
} = config;

class App {
  public app: Application;
  public port: number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = port;
    this.env = environment;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    // this.initializeSwagger();
  }

  public listen() {
    const onError = (error: { syscall: string; code: string }): void => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind =
        typeof this.port === "string"
          ? `Pipe ${this.port}`
          : `Port ${this.port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
        case "EADDRINUSE":
          console.error(`${bind} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    };

    const onListening = (): void => {
      console.info(`=================================`);
      console.info(`======= ENV: ${chalk.cyan(this.env)} =======`);
      console.info(`🚀 App listening on the port ${chalk.cyan(this.port)}`);
      console.info(`=================================`);
    };

    // Run listener
    const server = this.app
      .listen(this.port)
      .on("error", onError)
      .on("listening", onListening);

    socket(server);
  }

  private connectToDatabase = async () => {
    await mysql.sequelize.sync({ force: false });
    // .then(function () {
    //   return mysql.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    // });

    associateModels();

    await bootstrapApp();
  };

  private initializeMiddlewares() {
    i18n(this.app);

    httpLogger(this.app); //  Console log info regarding requests

    // this.app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));
    this.app.use(
      cors()
      // cors({
      //   origin: ["*"],
      // })
    );

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      })
    );
    this.app.use(cookieParser());

    this.app.use(express.static(path.resolve(`${__dirname}/../public`)));
    this.app.use(requestIp.mw());
    this.app.use(UserAgent.express());

    // View Engine Setup
    // this.app.set('views', path.join(__dirname))
    // this.app.set('view engine', 'hbs')
    this.app.set("views", path.resolve(`${__dirname}/../views`));
    this.app.set("view engine", "hbs");

    this.app.use(RequestHandler);
    this.app.use(ReqRateLimiterHandler);
    this.app.use(LatencyHandler);
  }

  private initializeRoutes() {
    modules(this.app);

    // Catch error 404 endpoint not found
    this.app.use("*", RouteNotFoundHandler);

    // Catch errors
    this.app.use(ErrorHandler);
  }

  // private initializeSwagger() {
  //   const options = {
  //     swaggerDefinition: {
  //       info: {
  //         title: 'REST API',
  //         version: '1.0.0',
  //         description: 'Example docs',
  //       },
  //     },
  //     apis: ['swagger.yaml'],
  //   };

  //   const specs = swaggerJSDoc(options);
  //   this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  // }
}

export default App;

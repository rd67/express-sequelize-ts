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
// import morgan from "morgan";
// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import DB from '@databases';

import {
  RequestHandler,
  LatencyHandler,
  RouteNotFoundHandler,
  ReqRateLimiterHandler,
} from "@middlewares/index";
import i18n from "@utils/i18n";
import mysql from "@utils/mysql";

import config from "@config/config";

import modules from "@modules/index";

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
    this.initializeErrorHandling();
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
    this.app
      .listen(this.port)
      .on("error", onError)
      .on("listening", onListening);
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase = async () => {
    await mysql.sequelize.sync({ force: false });
  };

  private initializeMiddlewares() {
    i18n(this.app);

    // this.app.use(morgan(config.get('log.format'), { stream }));
    // this.app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));
    this.app.use(
      cors({
        origin: ["*"],
      })
    );

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(express.static(path.resolve(`${__dirname}/../public`)));
    this.app.use(requestIp.mw());
    this.app.use(UserAgent.express());

    this.app.use(RequestHandler);
    this.app.use(ReqRateLimiterHandler);
    this.app.use(LatencyHandler);
  }

  private initializeRoutes() {
    modules(this.app);

    // Catch error 404 endpoint not found
    this.app.use("*", RouteNotFoundHandler);
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

  private initializeErrorHandling() {
    this.app.use(RouteNotFoundHandler);
  }
}

export default App;

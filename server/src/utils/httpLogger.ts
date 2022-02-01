import { Application } from "express";
import morgan from "morgan";
import morganJSON from "morgan-json";

import { ExpressUserReq } from "@interfaces/common";

import { STATUS_CODES } from "@constants/constants";

import { logInfo, logError } from "@helpers/common";

type HTTPLoggerParams = Record<string, string>;

class HTTPLoggerStream {
  write(message: string) {
    const data: HTTPLoggerParams = JSON.parse(message);

    if (Number(data.status) > STATUS_CODES.ACTION_COMPLETE) {
      logError({
        // timestamp: new Date().toString(),
        ...data,
      });
    } else {
      logInfo({
        // timestamp: new Date().toString(),
        ...data,
      });
    }
  }
}

export default (app: Application) => {
  morgan.token("reqId", (request: ExpressUserReq) => {
    return request.reqId;
  });

  morgan.token("userId", (request: ExpressUserReq) => {
    return `${request.user?.id}` || "0";
  });

  // morgan.token('ip', (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);

  const httpLoggerParams: HTTPLoggerParams = {
    kind: "httpLogger",
    reqId: ":reqId",
    method: ":method",
    url: ":url",
    status: ":status",
    contentLength: ":res[content-length]",
    responseTime: ":response-time",
    userId: ":userId",
  };

  const format = morganJSON(httpLoggerParams);

  app.use(
    morgan(format, {
      stream: new HTTPLoggerStream(),
      // skip: function (req, res) { return res.statusCode < 400 }
    })
  );

  // app.use(morgan(format, { stream: new HTTPLoggerStream() }));
};

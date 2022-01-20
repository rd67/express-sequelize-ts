import { STATUS_CODES, MESSAGES } from "@constants/constants";

export class OperationalError extends Error {
  public statusCode: number;
  public logError: boolean;
  public data: any;

  constructor(
    message: string = MESSAGES.serverError,
    statusCode: number = STATUS_CODES.ACTION_FAILED,
    logError: boolean = true,
    data: any = {}
  ) {
    super(message);

    if (statusCode === STATUS_CODES.ERROR) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.logError = logError;
    this.data = data;
  }
}

export class ActionFailedError extends Error {
  public statusCode: number = STATUS_CODES.ACTION_FAILED;
  public data: any;

  constructor(message: string, data: any = {}) {
    super(message);

    this.name = this.constructor.name;
    this.data = data;
  }
}

export class NotFoundError extends Error {
  public statusCode: number = STATUS_CODES.NOT_FOUND;

  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class ValidationError extends Error {
  public statusCode: number = STATUS_CODES.VALIDATION_FAILED;
  public data: any;

  constructor(data: any, message: string = MESSAGES.validationFailed) {
    super(message);

    this.message = message;
    this.name = this.constructor.name;
    this.data = data;
  }
}

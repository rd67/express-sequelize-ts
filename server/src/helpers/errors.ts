import { STATUS_CODES, MESSAGES } from "@constants/constants";

//  This one does not trans the error message
export class OperationalError extends Error {
  public statusCode: number;
  public data: any;
  public logError: boolean;

  constructor(
    message: string = MESSAGES.serverError,
    statusCode: number = STATUS_CODES.ACTION_FAILED,
    logError: boolean = true,
    data: any = {}
  ) {
    super(message);

    //  This is a fix for incorrect instanceOf
    Object.setPrototypeOf(this, OperationalError.prototype);

    // Ensure the name of this error is the same as the class name
    // this.name = this.constructor.name;
    this.name = ""; // Used to cause messages like "UserError: message" instead of the default "Error: message"
    this.data = data;
    this.statusCode = statusCode;
    this.logError = logError;
  }
}

export class ValidationError extends Error {
  public statusCode: number = STATUS_CODES.VALIDATION_FAILED;
  public data: any;
  public logError: boolean;

  constructor(
    data: any,
    message: string = MESSAGES.validationFailed,
    logError: boolean = true
  ) {
    super(message);

    //  This is a fix for incorrect instanceOf
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.name = this.constructor.name;
    this.message = message;
    this.data = data;
    this.logError = logError;
  }
}

export class ActionFailedError extends Error {
  public statusCode: number = STATUS_CODES.ACTION_FAILED;
  public data: any;
  public logError: boolean;

  constructor(message: string, data: any = {}, logError: boolean = true) {
    super(message);

    //  This is a fix for incorrect instanceOf
    Object.setPrototypeOf(this, ActionFailedError.prototype);

    this.name = this.constructor.name;
    this.data = data;
    this.logError = logError;
  }
}

export class NotFoundError extends Error {
  public statusCode: number = STATUS_CODES.NOT_FOUND;
  public logError: boolean;

  constructor(message: string, logError: boolean = false) {
    super(message);

    //  This is a fix for incorrect instanceOf
    Object.setPrototypeOf(this, NotFoundError.prototype);

    this.name = this.constructor.name;
    this.logError = logError;
  }
}

export class AuthFailedError extends Error {
  public statusCode: number;
  public logError: boolean = false;

  constructor(message: string, statusCode: number = STATUS_CODES.AUTH_FAILED) {
    super(message);

    //  This is a fix for incorrect instanceOf
    Object.setPrototypeOf(this, AuthFailedError.prototype);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.logError = statusCode === STATUS_CODES.FORBIDDEN;
  }
}

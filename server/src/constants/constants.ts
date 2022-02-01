export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACTION_PENDING: 202,
  ACTION_COMPLETE: 204,

  VALIDATION_FAILED: 400,
  ACTION_FAILED: 400,
  AUTH_FAILED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  ERROR: 500,
};

export const MESSAGES = {
  success: "Success.",
  serverError: "Something went wrong, Please try again.",
  routeNotFound: "Route not found.",
  validationFailed: "Validation Failed, Kindly check your parameters",
  badRequest: "Bad request",
  missingAuthHeader: "Auth token is missing",
  authTokenExpired: "Your auth token has expired, kindly login again",
  authTokenVerificationFailed:
    "Invalid auth token provided, kindly check it and try again",

  invalidJSON: "Invalid JSON provided",
  linkExpired: "Sorry, the following link has expired",

  tooManyRequest:
    "You sent too many requests, Please wait for a while then try again",

  missingPerm: "Sorry, you are not authorized, to access this resources.",

  incorrectPin: "Kindly check your credentials, incorrect pin",

  invalidOTP:
    "The OTP you have entered is wrong. Please try again or request a new OTP",

  phoneChangeSuccess: "Phone number changed successfully",
};

export const DEFAULT_PAGE_SIZE = 100;

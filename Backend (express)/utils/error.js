class HTTPError extends Error {
    constructor(message, statusCode, name) {
      super(message);
      this.statusCode = statusCode;
      this.name = name;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const InvalidDetailsError = (message) => new HTTPError(message, 400, "Invalid Input");
  
  const ForbiddenError = (message) => new HTTPError(message, 403, "Forbidden");
  
  const FieldError = (message) => new HTTPError(message, 400, "Field Error");
  
  const OperationFailedError = (message) => new HTTPError(message, 400, "Operation Failed");
  
  const UnauthorizedError = (message) => new HTTPError(message, 401, "Unauthorized");
  
  const NotFoundError = (message) => new HTTPError(message, 404, "Not Found");
  
  const ExpiredError = (message) => new HTTPError(message, 401, "Expired");
  
  const AlreadyExistError = (message) => new HTTPError(message, 400, "Exist Error.");
  
  const ApplicationError = (message) => new HTTPError(message, 400, "Application error.");
  
  const ExtractionFailed = (message) => new HTTPError(message, 400, "Failed to extract text from resume.");
  
  const ResumeNotSaved = (message) => new HTTPError(message, 400, "Resume not saved.");
  
  const ResumeInitializationError = (message) => new HTTPError(message, 400, "Failed to save resume");
  
  module.exports = {
    HTTPError,
    ForbiddenError,
    InvalidDetailsError,
    UnauthorizedError,
    FieldError,
    NotFoundError,
    ExpiredError,
    AlreadyExistError,
    ApplicationError,
    ExtractionFailed,
    ResumeNotSaved,
    OperationFailedError,
  };
  
  // module.exports = { HTTPError };
  
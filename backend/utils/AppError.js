class AppError extends Error {
    constructor(message, statusCode, errorData = null) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Mark this as an operational error (e.g., not a bug)
      this.errorData = errorData; // Optional: allows you to include extra info for debugging or logging
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  
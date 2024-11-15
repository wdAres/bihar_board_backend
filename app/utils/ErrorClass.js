class ErrorClass extends Error {
    constructor(message, statusCode) {
      super(message); // calling the constructor of Error  =>  new Error(message)
      this.statusCode = statusCode || 500;
      this.status = String(this.statusCode).startsWith("4") ? "fail" : "error";
  
      this.isOperational = true ; 
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ErrorClass;
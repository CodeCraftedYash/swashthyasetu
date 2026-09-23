// this is a custom error class

export class ApiError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly isOperational = true
    ){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor); 
    }
}
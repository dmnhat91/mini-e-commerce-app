import {ValidationError} from 'express-validator';

interface CustomError {
    statusCode: number;
    serializeErrors(): {
        message: string;
        field?: string;
    }[]

}

export class RequestValidationError extends Error implements CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]){
        super();

        // Only because we are extending a built-in class (aka. for this case, the Error class)
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(){
        return this.errors.map(err => {
            return {message: err.msg, field: err.param}
        });
    }

}

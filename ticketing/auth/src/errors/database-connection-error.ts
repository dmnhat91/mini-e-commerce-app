export class DatabaseConnectionError extends Error {
    reason = 'Error connecting to datbase'

    constructor(){
        super();

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}
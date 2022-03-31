import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from '../errors/request-validation-error';
import {DatabaseConnectionError} from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')   // get email property out of body
        .isEmail()  // check valid email
        .withMessage('Email must be valid'), // print out message

    body('password')
        .trim() // trim out trailing/leading spaces
        .isLength({min: 4, max: 20}) //limit password to be min 4, max 20
        .withMessage("Password must be between 4 and 20 characters")

], 
(req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const {email, password} = req.body;

    console.log('Creating a user...');
    throw new DatabaseConnectionError();

    res.send({});
    
});

export { router as signupRouter}; //rename because we have many routers (they can't be the same name)
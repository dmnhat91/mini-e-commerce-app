import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import {BadRequestError} from '../errors/bad-request-error';

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
validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser){
        throw new BadRequestError('Email in use');
    }

    const user = User.build({email, password});
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({ // Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!); //process.env.JWT_KEY!: the exclamation to tell TypeScript not to worry about the check. We already check whether the env var is defined in index.ts (when the app starts already).

    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as signupRouter}; //rename because we have many routers (they can't be the same name)
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import jwt from 'jsonwebtoken';

import {Password} from '../services/password';
import {User} from '../models/user';
import {validateRequest} from '../middlewares/validate-request';
import {BadRequestError} from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser){ //if user does not exist
        throw new BadRequestError('Invalid credentials');
    }

    //compare passwords
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid credentials');
    }

    //generate JWT token and send
    // Generate JWT
    const userJwt = jwt.sign({ // Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!); //process.env.JWT_KEY!: the exclamation to tell TypeScript not to worry about the check. We already check whether the env var is defined in index.ts (when the app starts already).

    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
});

export { router as signinRouter}; //rename because we have many routers (they can't be the same name)
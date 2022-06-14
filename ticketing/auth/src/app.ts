import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {errorHandler} from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); //traffic is directed through Ingress nginx, by default, express will think like 'hey there is a proxy here, we don't trust this https connection'. So we do this so that the app is aware it is behind the proxy of Ingress nginx and trust the proxy being secure.
app.use(json());
app.use(
    cookieSession({
        signed: false, //disable cookie encryption
        secure: true
    }) 
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};
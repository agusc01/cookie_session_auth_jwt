
import express, { Request, Response } from 'express';
import { testDataBaseWithSequelice } from './config/db.config';
import { checkEnvironments, envConfig } from './config/env.config';
import { Env } from './models/enums/env.enum';
import { authRouter } from './router/auth.router';
import { commonRouter } from './router/common.router';
import { localsSetLogged } from './services/locals.service';
import { initSession, sessionGetIsLogged } from './services/session.service';
import { router } from './utils/router.util';

const methodOverride = require('method-override');

require('dotenv').config();
checkEnvironments('key value');

const app = express();
const port = envConfig(Env.APP_PORT);
const host = `${envConfig(Env.APP_HOST)}:${port}`;

app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));

// * SESSION
app.use(initSession());
app.use((req, res, next) => {
    localsSetLogged(res, sessionGetIsLogged(req));
    next();
});


app.use(router('/auth'), authRouter);
app.use(router('/'), commonRouter);

app.use(async (req: Request, res: Response) => {
    return res.status(404).send({ msg: 'Página no encontrada' });
});


app.listen(port, () => {
    console.log('-----------------------------------------------------');
    console.log(`Aplicación corriendo en : ${host}`);
    console.log('-----------------------------------------------------');
});

testDataBaseWithSequelice();
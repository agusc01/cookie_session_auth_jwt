
import bcrypt from 'bcrypt';
import { envConfig } from '../config/env.config';
import { Env } from '../models/enums/env.enum';
import { IHandlerResponse } from '../models/interfaces/handler-response.interface';
import { IUser } from '../models/interfaces/user.interface';
import { JWTGenerate } from '../services/jwt.service';
import { localsSetLogged } from '../services/locals.service';
import { sessionSetIsLogged } from '../services/session.service';
import { getOneUserByEmail, saveOneUser } from '../services/user.service';


require('dotenv').config();
const dbLogin = envConfig(Env.DB_MSG_ERROR_LOGIN_USER);

export const login: IHandlerResponse = async (req, res) => {
    const { email, password } = req.body;
    const resp = await getOneUserByEmail(email);

    if (resp.isError) {
        return res.status(203).send({ msg: resp.data });
    }

    const user = resp.data as IUser;
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(203).send({ msg: dbLogin });
    }

    const { uuid } = user;
    const payload = await JWTGenerate({ email, uuid });

    if (payload.isError) {
        return res.status(payload.httpStatus ?? 500).send({ msg: payload.data });
    }

    const token = payload.data;

    localsSetLogged(res, true);
    sessionSetIsLogged(req, true);

    return res.status(202).send({ token });
};

export const logout: IHandlerResponse = async (req, res) => {
    localsSetLogged(res, false);
    sessionSetIsLogged(req, false);
    return res.status(200).send({ msg: 'Ha cerrado sessión' });
};

export const register: IHandlerResponse = async (req, res) => {

    const { email, password } = req.body;

    const salt = envConfig(Env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    const resp = await saveOneUser({ email, password: hashedPassword });

    if (resp.isError) {
        return res.status(500).send({ msg: resp.data });
    }

    return res.status(200).send({ msg: 'Usuario creado éxitosamente' });
};

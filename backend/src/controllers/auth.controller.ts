
import bcrypt from 'bcrypt';
import { envConfig } from '../config/env.config';
import { Env } from '../models/enums/env.enum';
import { IHandlerResponse } from '../models/interfaces/handler-response.interface';
import { IUser } from '../models/interfaces/user.interface';
import { localsSetLogged } from '../services/locals.service';
import { sessionSetLogged } from '../services/session.service';
import { getOneUserByEmail, saveOneUser } from '../services/user.service';


require('dotenv').config();
const dbError = envConfig(Env.DB_MSG_ERROR);

export const login: IHandlerResponse = async (req, res) => {
    const { email, password } = req.body;
    const resp = await getOneUserByEmail(email);

    if (resp.isError) {
        return res.status(203).send({ msg: resp.data });
    }

    const user = resp.data as IUser;
    const match = await bcrypt.compare(password, user.password);

    if (match) {
        localsSetLogged(res, true);
        sessionSetLogged(req, true);
        return res.status(202).send({ msg: 'Ha iniciado sesión' });
    }

    if (resp.isError) {
        return res.status(203).send({ msg: resp.data });
    }

    return res.status(500).send({ msg: 'Error interno' });

};

export const logout: IHandlerResponse = async (req, res) => {
    localsSetLogged(res, false);
    sessionSetLogged(req, false);
    return res.status(200).send({ msg: 'Ha cerrado sessión' });
};

export const register: IHandlerResponse = async (req, res) => {

    const { email, password } = req.body;

    const salt = envConfig(Env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    const resp = await saveOneUser({ email, password: hashedPassword });

    if (resp.isError) {
        return res.status(500).send({ msg: 'Error en la base de datos' });
    }

    return res.status(200).send({ msg: 'Usuario creado éxitosamente' });
};

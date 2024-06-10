import { IGuard } from "../models/interfaces/guard.interface";
import { sessionGetIsLogged } from "../services/session.service";

export const isNotLoggedGuard: IGuard = async (req, res, next) => {

    if (sessionGetIsLogged(req)) {
        return res.status(406).send({ msg: 'No aceptado. Ya esta logeado' });
    }

    return next();
};
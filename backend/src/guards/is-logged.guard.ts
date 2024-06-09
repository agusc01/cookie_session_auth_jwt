import { IGuard } from "../models/interfaces/guard.interface";
import { sessionGetLogged } from "../services/session.service";

export const isLoggedGuard: IGuard = async (req, res, next) => {

    if (sessionGetLogged(req)) {
        return next();
    }

    return res.status(401).send({ msg: 'No esta logeado' });
};
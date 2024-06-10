import { IGuard } from "../models/interfaces/guard.interface";
import { sessionGetIsLogged } from "../services/session.service";

export const isLoggedGuard: IGuard = async (req, res, next) => {

    if (!sessionGetIsLogged(req)) {
        return res.status(401).send({ msg: 'No esta logeado' });
    }

    return next();
};
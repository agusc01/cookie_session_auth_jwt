import { IGuard } from "../models/interfaces/guard.interface";
import { sessionGetIsLogged } from "../services/session.service";

export const isNotLoggedGuard: IGuard = async (req, res, next) => {

    // const resp = await JWTGetPayLoad(req);

    // if (resp.isError) {
    //     return res.status(500).send({ msg: resp.data });
    // }

    if (sessionGetIsLogged(req)) {
        return res.status(406).send({ msg: 'No aceptado. Ya esta logeado' });
    }

    return next();
};
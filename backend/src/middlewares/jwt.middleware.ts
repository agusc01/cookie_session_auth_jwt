import { Request, Response } from "express";
import { JWTGetPayLoad } from "../services/jwt.service";
import { localsSetLogged } from "../services/locals.service";
import { sessionSetIsLogged } from "../services/session.service";

export const JWTMiddleware = async (req: Request, res: Response, next: any): Promise<unknown> => {

    const resp = await JWTGetPayLoad(req);

    if (resp.isError) {
        localsSetLogged(res, false);
        sessionSetIsLogged(req, false);
        return res.status(resp.httpStatus ?? 500).send({ msg: resp.data });
    }

    next();
};
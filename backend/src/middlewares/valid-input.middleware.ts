import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const validInputMiddleware = (req: Request, res: Response, next: any): void => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        next();
        return;
    }

    const errorsArray = errors.array();
    const errores = errorsArray.map(error => {
        const mensaje = {
            text: error.msg ?? 'Desconocido',
            input: (error as any)?.path ?? 'Desconocido'
        };
        return mensaje;
    });

    res.status(406).send({ msg: errores });
};
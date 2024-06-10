import { Request, Response, Router } from "express";
import { isLoggedGuard } from "../guards/is-logged.guard";
import { JWTMiddleware } from "../middlewares/jwt.middleware";
import { router } from "../utils/router.util";

export const commonRouter = Router();

commonRouter.get(router('/pagina-publica'), async (req: Request, res: Response) => {
    return res.status(200).send({ msg: 'Página de pública' });
});

commonRouter.get(router('/pagina-privada'), isLoggedGuard, JWTMiddleware, async (req: Request, res: Response) => {
    console.log({ Bearer_Token: req.headers.authorization }); //README INFO
    console.log({ cookie_session: req.headers.cookie }); //README INFO
    return res.status(200).send({ msg: 'Página de privada' });
});
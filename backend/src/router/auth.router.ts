import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { isLoggedGuard } from "../guards/is-logged.guard";
import { isNotLoggedGuard } from "../guards/is-not-logged.guard";
import { validInputMiddleware } from "../middlewares/valid-input.middleware";
import { router } from "../utils/router.util";
import { loginValidation, registerValidation } from "../validations/auth.validation";

export const authRouter = Router();

authRouter.post(router('/iniciar-sesion'), isNotLoggedGuard, loginValidation, validInputMiddleware, login);
authRouter.post(router('/registrarse'), isNotLoggedGuard, registerValidation, validInputMiddleware, register);
authRouter.get(router('/cerrar-sesion'), isLoggedGuard, logout);
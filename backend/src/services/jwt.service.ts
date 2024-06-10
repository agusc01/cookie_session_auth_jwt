import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { envConfig } from "../config/env.config";
import { Env } from "../models/enums/env.enum";
import { IResponseDb } from "../models/interfaces/response-db.interface";
import { IUser } from "../models/interfaces/user.interface";
import { takeMsgError } from "../utils/takeMsgError.util";

const jwtKey = String(envConfig(Env.JWT_PRIVATE_KEY));

const msgErrorRead = envConfig(Env.DB_MSG_ERROR_READ);
const msgErrorCreate = envConfig(Env.DB_MSG_ERROR_CREATE);

export const JWTGenerate = async ({ uuid, email }: Partial<IUser>): Promise<IResponseDb<string>> => {

    try {

        if (!uuid) { throw new Error('No tenemos el uuid del usuario'); }
        if (!email) { throw new Error('No tenemos el email del usuario'); }

        const jwtConstructor = new SignJWT({ uuid, email });
        const encoder = new TextEncoder();
        const jwt = await jwtConstructor
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("1m")
            .sign(encoder.encode(jwtKey));

        return { data: jwt, isError: false };

    } catch (e: any) {
        return { isError: true, data: takeMsgError(e) };
    } finally { }

};

export const JWTGetPayLoad = async (req: any): Promise<IResponseDb<JWTPayload | string>> => {
    try {
        const { authorization } = req.headers;
        console.log({ authorization }); //README INFO

        if (!authorization) return { isError: true, data: 'No tiene autorización', httpStatus: 203 };

        const jwt = authorization.split('Bearer ')[1];

        console.log({ jwt }); //README INFO
        if (!jwt) return { isError: true, data: 'No tiene autorización', httpStatus: 203 };

        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(jwt, encoder.encode(jwtKey));

        console.log({ payload }); //README INFO
        return { isError: false, data: payload };
    } catch (e: any) {
        return { isError: true, data: takeMsgError(e), httpStatus: 500 };
    } finally { }
};

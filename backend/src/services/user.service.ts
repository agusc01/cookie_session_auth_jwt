import { envConfig } from '../config/env.config';
import { User } from '../models/classes/user.class';
import { Env } from '../models/enums/env.enum';
import { IResponseDb } from '../models/interfaces/response-db.interface';
import { IUser } from '../models/interfaces/user.interface';
import { takeMsgError } from '../utils/takeMsgError.util';

require('dotenv').config();

const msg_error_login_user = envConfig(Env.DB_MSG_ERROR_LOGIN_USER);
const msg_error_read = envConfig(Env.DB_MSG_ERROR_READ);
const msg_error_create = envConfig(Env.DB_MSG_ERROR_CREATE);

export const getOneUserByEmail = async (email: string): Promise<IResponseDb<IUser | string>> => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) { throw new Error(`${msg_error_login_user}`); }
        return { isError: false, data: user };
    } catch (e: any) {
        return { isError: true, data: `${msg_error_read} ${takeMsgError(e)}.` };
    } finally { }
};


export const saveOneUser = async (user: IUser): Promise<IResponseDb<IUser | string>> => {
    try {
        const newUser = await User.create(user);
        return { isError: false, data: newUser };
    } catch (e: any) {
        return { isError: true, data: `${msg_error_create} ${takeMsgError(e)}.` };
    } finally { }
};

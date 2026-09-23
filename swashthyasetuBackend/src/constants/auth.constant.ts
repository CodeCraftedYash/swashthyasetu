//refresh = 7d
//accesss = 15m
import ms from "ms";
import { env } from "../config/env";

const REFRESH_TOKEN_EXPIRY = Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN);
const ACCESS_TOKEN_EXPIRY = Date.now() + ms(env.ACCESS_TOKEN_EXPIRES_IN);

const getAccessTokenExpiry = ():Date=> {
    return new Date(ACCESS_TOKEN_EXPIRY);
}

const getRefreshTokenExpiry = ():Date=> {
    return new Date(REFRESH_TOKEN_EXPIRY);
}

export {getAccessTokenExpiry,getRefreshTokenExpiry};
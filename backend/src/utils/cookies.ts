import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";
const secure = NODE_ENV !== "development"

type params = {
    res : Response;
    accessToken : string;
    refreshToken : string;
}

const defaults : CookieOptions = {
    sameSite : "strict",
    httpOnly : true,
    secure
}

const getAccessTokenCookieOptions = () : CookieOptions => ({
    ...defaults,
    expires : fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = () : CookieOptions => ({
    ...defaults,
    expires : thirtyDaysFromNow(),
    path : "/auth/refresh"
})

const setAuthCookies = ({res , accessToken , refreshToken} : params) => res.cookie("accessToken" , accessToken , getAccessTokenCookieOptions()).cookie("refreshToken" , refreshToken , getRefreshTokenCookieOptions());


export default setAuthCookies;
import {HttpStatusCode} from "../constants/http";
import {AppErrorCode} from "../constants/appErrorCode";
import {AppError} from "./AppError";
import assert from "assert";

type AppAssert = (
    condition: any,
    httpSatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode,
) => asserts condition;

const appAssert: AppAssert = (
    condition,
    httpSatusCode,
    message,
    appErrorCode
) => assert(condition ,new AppError(httpSatusCode , message , appErrorCode));

export default appAssert;
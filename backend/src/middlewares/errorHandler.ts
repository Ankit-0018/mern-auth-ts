import { ErrorRequestHandler } from "express"
import { INTERNAL_SERVER_ERROR } from "../constants/http";

const errorHandler: ErrorRequestHandler = (err , req , res , next) => {
    console.log(`PATH: ${req.path} -- ERROR: ${err}`);
    return res.status(INTERNAL_SERVER_ERROR).json({
        message : "Internal Server Error"
    })
}

export default errorHandler;
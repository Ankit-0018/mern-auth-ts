import { ErrorRequestHandler, Response } from "express"
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";

const handleZodError = (res : Response  , errors : z.ZodError) =>{
const error = errors.issues.map((issue) => {
    return {
        path : issue.path.join('.'),
        message : issue.message
    }
})
    res.status(400).json({
        message: "Bad Request",
        error
    })
}

const errorHandler: ErrorRequestHandler = (err , req , res , next) => {

    if(err instanceof z.ZodError) {
        return handleZodError(res , err);
    }

    console.log(`PATH: ${req.path} -- ERROR: ${err}`);
    return res.status(INTERNAL_SERVER_ERROR).json({
        message : "Internal Server Error"
    })
}

export default errorHandler;
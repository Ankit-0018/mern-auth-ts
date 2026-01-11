import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import verificationCodeType from "../constants/verificationCodeTypes";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/verificationCode.model";


export type createAccountParams = {
    email : string;
    password : string;
    userAgent? : string;
}

export const createAccount = async (data : createAccountParams) => {
    const existingUser = await UserModel.exists({
        email : data.email
    }) 
    if(existingUser){
        throw new Error("User already exists")
    }  

    const user = await UserModel.create({
        email : data.email,
        password : data.password,
    })

    const verificationCode = await verificationCodeModel.create({
        userId : user._id,
        type : verificationCodeType.EmailVerification,
    })

    const session = await sessionModel.create({
        userId : user._id,
        userAgent : data.userAgent ?? "unknown"
    })

    const refreshToken = jwt.sign({
        sessionId : session._id
     } , JWT_REFRESH_SECRET, {
        expiresIn : "30d",
        audience : ['user']
     })

     const accessToken = jwt.sign({
        userId : user._id,
        sessionId : session._id
     } , JWT_SECRET , {
        expiresIn : "15m",
        audience : ["user"]
     })

     return {user , refreshToken , accessToken}
}
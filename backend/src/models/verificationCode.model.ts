import mongoose from "mongoose";
import verificationCodeType from "../constants/verificationCodeTypes";
import { oneYearFromNow } from "../utils/date";


interface VerificationModelDocument extends mongoose.Document {
    userId : mongoose.Types.ObjectId,
    type : verificationCodeType,
    createdAt : Date,
    expiresAt : Date
}

const verificationCodeSchema = new mongoose.Schema<VerificationModelDocument>({
    userId : { type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true , index : true},
    type : {type : String , required : true},
    createdAt : {type : Date , required : true , default : Date.now},
    expiresAt : {type : Date , required : true , default : oneYearFromNow}
})


const verificationCodeModel = mongoose.model<VerificationModelDocument>("verficationCode",
 verificationCodeSchema ,
 "verification_codes");

export default verificationCodeModel;
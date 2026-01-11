import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email : string;
    password : string;
    verified : boolean;
    createdAt : Date;
    updatedAt : Date;
    comparePassword(val:string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
    email : {type : String , required : true},
    password : {type : String , required : true},
    verified : {type : Boolean , default : false}
}, {
    timestamps : true
})

userSchema.pre("save" , async function (){
    if (!this.isModified("password")){
        return;
    }
    this.password = await hashPassword(this.password , 8);
})

userSchema.methods.comparePassword = async function (value : string){
   return await comparePassword(value , this.password)
} 

const UserModel = mongoose.model<UserDocument>("User" , userSchema);

export default UserModel;
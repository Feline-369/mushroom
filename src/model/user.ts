//mongodb k schemas 

import mongoose, {Schema, Document} from "mongoose";
import { Content } from "next/font/google";

// we define datatype at first in typscript
//interface definition
export interface Message extends Document{
    content:string;
    createdAt: Date
}//standard code in typescript

//we define the datatype of schema (MessageSchema) as that of message
//schema definition 
const MessageSchema: Schema<Message>=new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

//similarly form schema for user 
export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    messages: Message[]
}

const UserSchema: Schema<User>=new Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type:String,
        required: [true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,'Use valid Email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
})


//nextjs run on edge so doesn't know whether this app is boot up 1st time or not so data export is kinda different
//checking both cases if database not present make one using mongodb
const UserModel=(mongoose.models.User as 
    /* we use this extra line to define the schema in typescript*/
    mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;













//schema is diagramatic/ logical representation of data 
//
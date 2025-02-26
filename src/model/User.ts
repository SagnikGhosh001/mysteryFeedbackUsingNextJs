import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document{
    _id: string;
    content:string;
    createdAt:Date;
}

const MessageSchema : Schema<Message>=new Schema({
    content:{
        
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})


export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpriry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
    createdAt:Date;
}

const UserSchema : Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true,
        match:[/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"],
    },
    verifyCodeExpriry:{
        type:Date,
        required:[true,"Verify code expriry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})


const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)

export default UserModel
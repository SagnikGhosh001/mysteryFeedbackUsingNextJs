import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function  senVerificationEMail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:'sagnikghosh904@email.com',
            to:email,
            subject:'Mystery Feedback Verification Code',
            react: VerificationEmail({ username: username,otp:verifyCode }),
        });
        return {success:true,message:"Verification email send sucessfully"}
    } catch (emailerror) {
        console.error("error sending verification email",emailerror)
        return {success:false,message:"Failed to send verification email"}
    }
}


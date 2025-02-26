import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, code } = await request.json();
    if(!username||!code){      
        return Response.json(
          {
              success:false,
              message: 'Please provide all fields'
          },{status: 500}
      )
      }
    const result=verifySchema.safeParse({code})    
    if(!result.success){
        const verifyCodeErrors=result.error.format().code?._errors||[]
        return Response.json(
            {
                success:false,
                message: verifyCodeErrors?.length>0 ? verifyCodeErrors.join(','):'Please Use 6 characters'
            },{status: 400}
        )
    }
    const decodedUsername=decodeURIComponent(username);
    const user=await UserModel.findOne({username:decodedUsername})
    if(!user){
        return Response.json(
            {
                success:false,
                message: 'User Not Found'
            },{status: 500}
        )
    }
    if(user.isVerified){
        return Response.json(
            {
                success:false,
                message: 'Already Verfied'
            },{status: 400}
        )
    }
    const isCodeValid=user.verifyCode===code
    const isCodeNotExpire=new Date(user.verifyCodeExpriry)>new Date()
    if(isCodeValid && isCodeNotExpire){
        user.isVerified=true
        await user.save()
        return Response.json(
            {
                success:true,
                message: 'User Verified Successfully'
            },{status: 200}
        )
    }else if(!isCodeNotExpire){
        return Response.json(
            {
                success:false,
                message: 'verification code has been expired please sign up again to get a new code'
            },{status: 400}
        )
    }else{
        return Response.json(
            {
                success:false,
                message: 'Incorrect verification Code'
            },{status: 400}
        )
    }
  } catch (error) {
    console.error("Error verifying user,", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}

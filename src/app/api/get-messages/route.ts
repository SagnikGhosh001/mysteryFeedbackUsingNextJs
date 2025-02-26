import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;
  if (!session || !session.user)
    return Response.json(
      {
        sucsess: false,
        message: "not Autheticated",
      },
      { status: 401 }
    );

  const userId = new mongoose.Types.ObjectId(sessionUser._id) ;
  try {
    const user= await UserModel.aggregate([
        {$match:{id:userId}},
        {$unwind:'$messages'},
        {$sort:{'messages.createdAt':-1}},
        {$group:{_id:'$_id',messages:{$push:'$messages'}}}
    ])
    if(!user || user.length===0){
        return Response.json(
            {
              sucsess: false,
              message: "User not found",
            },
            { status: 404 }
          );
    }
    return Response.json(
        {
          sucsess: true,
          messages: user[0].messages,
        },
        { status: 200 }
      );
  } catch (error) {
    console.log('error for fetching message',error);
    
    return Response.json(
        {
          sucsess: false,
          message: "error for fetching message",
        },
        { status: 500 }
      );
  }

}

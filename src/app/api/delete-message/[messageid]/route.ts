import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest, // Use NextRequest for consistency
  { params }: { params: Promise<{ messageid: string }> }
) {
  const {messageid} = await params;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        sucsess: false,
        message: "not Autheticated",
      },
      { status: 401 }
    );
  }

  try {    
    const messageObjectId = new mongoose.Types.ObjectId(messageid);
    const deleteMessageResult = await UserModel.updateOne(
      { _id: sessionUser._id },
      { $pull: { messages: { _id: messageObjectId } } }
    );    
    if (
      deleteMessageResult.modifiedCount == 0) {
      return Response.json(
        {
          sucsess: false,
          message: "Message Not Found Or Deleted",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        sucsess: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('error for deleting message',error);
    return Response.json(
      {
        sucsess: false,
        message: "Error for deleting message",
      },
      { status: 500 }
    );
  }
}

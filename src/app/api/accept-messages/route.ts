import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
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

  const userId = sessionUser._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          sucsess: false,
          message: "failed TO update user status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        sucsess: true,
        message: "Message Acceptance status Updates SUccessfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed TO update user status to accept messages", error);

    return Response.json(
      {
        sucsess: false,
        message: "failed TO update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  // console.log('session',session);
  
  const sessionUser: User = session?.user as User;
  // console.log('sessionuser',sessionUser);
  if (!session || !session.user)
  {
    return Response.json(
      {
        sucsess: false,
        message: "not Autheticated",
      },
      { status: 401 }
    );

  }
    

  const userId = sessionUser._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          sucsess: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        sucsess: true,
        isAccesptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed TO found User", error);

    return Response.json(
      {
        sucsess: false,
        message: "error in getting user accepting message",
      },
      { status: 500 }
    );
  }
}

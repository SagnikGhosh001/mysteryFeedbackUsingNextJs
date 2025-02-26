import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  if (!username || !content) {
    return Response.json(
      {
        success: false,
        message: "Please provide all fields",
      },
      { status: 500 }
    );
  }
  const result=messageSchema.safeParse({content})         
          if(!result.success){
            const sendMessageErrros=result.error.format().content?._errors||[]         
              return Response.json(
                  {
                      success:false,
                      message: sendMessageErrros.length>0  ? sendMessageErrros.join(','):'Please send valid message'
                  },{status: 400}
              )
          }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          sucsess: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          sucsess: false,
          message: "user does not accept messages",
        },
        { status: 403 }
      );
    }

    const newMessage={content,createdAt:new Date()}
    user.messages.push(newMessage as Message)
    await user.save()
    return Response.json(
        {
          sucsess: true,
          message: "message send successfully",
        },
        { status: 200 }
      );
  } catch (error) {
    console.log("error for sening message", error);

    return Response.json(
      {
        sucsess: false,
        message: "error for sending message",
      },
      { status: 500 }
    );
  }
}

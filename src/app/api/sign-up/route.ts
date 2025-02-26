import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/schemas/signUpSchema";
import { senVerificationEMail } from "@/helpers/sendVerificatonEmail";
// senVerificationEMail;

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Please provide all fields",
        },
        { status: 500 }
      );
    }

    const result = signUpSchema.safeParse({ username, email, password });
    if (!result.success) {
      const signuperrors = {
        username: result.error.format().username?._errors.join(", ") || "", // Join errors with comma
        email: result.error.format().email?._errors.join(", ") || "", // Join errors with comma
        password: result.error.format().password?._errors.join(", ") || "",
      };
      const hasErrors = Object.values(signuperrors).some(
        (err) => err.length > 0
      );
      return Response.json(
        {
          success: false,
          message: hasErrors ? signuperrors : "Please use valid field",
        },
        { status: 400 }
      );
    }
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedpassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashedpassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpriry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedByEmail.save();
      }
    } else {
      const hashedpassword = await bcrypt.hash(password, 10);
      const expriryDate = new Date();
      expriryDate.setHours(expriryDate.getHours() + 1);

      const newUser = await new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode,
        verifyCodeExpriry: expriryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
        createdAt: new Date(),
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await senVerificationEMail(
      email,
      username,
      verifyCode
    );
    // console.log(email,username,verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user registered succesfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}

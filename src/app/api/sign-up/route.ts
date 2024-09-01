import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        // user -> new / existing(verified or unverified)

        const existingUserVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedUsername){
            return Response.json({
                message: "Username already exists and is verified",
                success: false
            },{status: 201})
        }

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() +1);
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUserByEmail = await  UserModel.findOne({
            email
        })
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    message: "User already registered with the same email",
                    success: false
                },{status: 400})
            }
            else{
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                existingUserByEmail.password = hashedPassword;
                await existingUserByEmail.save();
            }
        }
        else{
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        const sendEmailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!sendEmailResponse.success){
            return Response.json({
                success: false,
                message: "Error in sending verification code - "+ sendEmailResponse.message 
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "Verification code sent successfully & is valid for one hour only - "+ sendEmailResponse.message 
        }, {status: 200})

    } catch (error) {
        console.error("Error registering the user-", error);
        return Response.json({
            success: false,
            message: "Error registering the user"
        }, {status: 500})
    }

}
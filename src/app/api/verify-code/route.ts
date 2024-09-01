import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signup.schema";
import { verifysignupSchema } from "@/schemas/verifysignup.schema";
import {z} from "zod"


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
    try {
        const searchParams = new URL(request.url).searchParams;
        const username = searchParams.get('username');
        const verifyCode = searchParams.get('verifycode');
        
        const result1 = usernameQuerySchema.safeParse({username});
        const result2 = verifysignupSchema.safeParse({code:verifyCode});

        if(!result1.success || !result2.success){
            return Response.json({
                message: "Username or otp is of invalid format",
                success: false
            },{status:400})
        }

        const user = await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json({
                message: "Username not found",
                success: false
            },{status:404})
        }

       

        const currDate = new Date();

        if(user.verifyCodeExpiry < currDate){
            return Response.json({
                message: "otp expired, signup again to get new code",
                success: false
            },{status:401})
        }

        if(user.verifyCode !== verifyCode){
            return Response.json({
                message: "invalid otp",
                success: false
            },{status:401})
        }

        
        user.isVerified = true;

        await user.save();

        return Response.json({
            message: "User verified successfully!",
            success: true
        },{status:200})


    } catch (error) {
        console.log("Error in verifying code", error);
        return Response.json({
            message: "Some error in verifying code",
            success: false
        },{status:500})
    }
}

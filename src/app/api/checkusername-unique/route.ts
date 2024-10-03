import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signup.schema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);

        if(!result.success){
            const errorMessages = result.error.format().username?._errors || [];
            const message = errorMessages?.length>0 ? errorMessages.join(', ') : "username not valid";
            return Response.json({
                message,
                success: false
            },{status: 400})
        }

        const existingUserVerifiedUsername = await UserModel.findOne({
            username: result.data.username
        })
        if(existingUserVerifiedUsername){
            return Response.json({
                message: "Username already taken",
                success: false
            },{status: 400})
        }

        return Response.json({
            message: "Username available!",
            success: true
        },{status: 200})
        

    } catch (error) {
        console.error("Error checking the username -", error);
        return Response.json({
            success: false,
            message: "Error checking the username"
        }, {status: 500})
    }

}
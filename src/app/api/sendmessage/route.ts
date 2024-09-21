import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {Message} from "@/model/user.model"


export async function POST(request: Request){
    try {
        await dbConnect();
        
        const {username, content} = await request.json();

        const user = await UserModel.findOne({username});

        if(!user || !user.isAcceptingMessage){
            return Response.json({
                message: "User not Available to take the message.",
                success: false
            },{status:401})
        }


        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message);

        await user.save();
        
        
        return Response.json({
            message: "Message sent successfully.",
            success: true
        },{status:200})

    } catch (error) {
        return Response.json({
            message: "Internal Server error in sending message.",
            success: false
        },{status:500})
    }
}
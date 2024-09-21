import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function GET(request: Request){
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return Response.json({
                message: "Unauthorized access! User not logged in.",
                success: false
            },{status:401})
        }

        const user = session.user;

        const userId = new mongoose.Types.ObjectId(user._id);

        const dbUser = await UserModel.aggregate([
            {$match : {id: userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!dbUser || !dbUser.length){
            return Response.json({
                message: "User not found.",
                success: false
            },{status:404})
        }

        return Response.json({
            message: "Messages Retrieved successfully!",
            success: true,
            messages: dbUser[0].messages
        },{status:200})


    } catch (error) {
        return Response.json({
            message: "Internal Server error in getting messages.",
            success: false
        },{status:500})
    }
}
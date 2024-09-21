import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request : Request) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        
        if(!session || !session.user){
            return Response.json({
                message: "Unauthorized Access! User not logged in.",
                success: false
            },{status:401})        
        }

        const user = session?.user;

        const updtUser = await UserModel.findByIdAndUpdate(user._id,{isAcceptingMessage: !user.isAcceptingMessages}, {new: true});

        if(!updtUser){
            return Response.json({
                message: "User not updated.",
                success: false
            },{status:400})
        }

        return Response.json({
            message: "Accept Message toggled successfully.",
            success: true,
            user: updtUser
        },{status:200})


    } catch (error) {
        return Response.json({
            message: "Internal Server error in toggling accept messages.",
            success: false
        },{status:500})        
    }


}


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

        const dbUser = await UserModel.findById(user._id);

        if(!dbUser){
            return Response.json({
                message: "User not found.",
                success: false
            },{status:404})
        }

        return Response.json({
            message: "Accept Message Status got successfully!",
            success: true,
            isAcceptingMessage: dbUser.isAcceptingMessage
        },{status:200})


    } catch (error) {
        return Response.json({
            message: "Internal Server error in getting accepMessage Status.",
            success: false
        },{status:500})
    }
}
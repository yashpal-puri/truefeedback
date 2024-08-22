import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"


export const authOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email or username" },
                password: { label: "Password", type: "password", placeholder: "your-password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                try {
                    await dbConnect();
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user) throw new Error("No user found with this email");

                    if(!user.isVerified) throw new Error("User is not Verified yet");

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    
                    if(!isValidPassword) throw new Error("Invalid Password");

                    return user;
                } catch (error:any) {
                    throw new Error(error.message);                    
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET?.toString(),
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        }
    }
}
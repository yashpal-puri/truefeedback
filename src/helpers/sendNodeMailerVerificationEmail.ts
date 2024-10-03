import { ApiResponse } from "@/types/apiResponse";
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: String(process.env.NODEMAILER_USERNAME), 
                pass: String(process.env.NODEMAILER_PASSWORD), 
            }
        });

        const mailOptions = {
            from: String(process.env.NODEMAILER_FROM),
            to: email, 
            subject: 'Verification Email for TrueFeedback by Yashpal Puri', 
            text: `Hello, ${username} \n Please Verify the code ${verifyCode} at our website to continue using our website.`, 
        };

        const info = await transporter.sendMail(mailOptions);
    
        return {success : true, message: "Verification code sent successfully to your email "+ email.slice(0,2)+ "******"};
    
        
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return { success : false, message: "Failed to send verification email"};
    }
}
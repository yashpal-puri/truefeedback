import VerificationEmail from "@/emails/verification_email";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verification Code by Yash's Website",
            react: VerificationEmail({username,otp: verifyCode}),
        });

        return {success : true, message: "Verification code sent successfully to your email "+ email.slice(0,2)+ "******"};
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return { success : false, message: "Failed to send verification email"};
    }
}

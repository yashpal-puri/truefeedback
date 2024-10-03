import {z} from 'zod';


 export const signinSchema = z.object({
    identifier : z.string().min(1,"Your email or username is required"),
    password: z.string().min(6,"Password must be of minimum length 6")
})
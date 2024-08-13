import {z} from 'zod';


 export const signinSchema = z.object({
    identifier : z.string(),
    password: z.string().min(6,"Password must be of minimum length 6")
})
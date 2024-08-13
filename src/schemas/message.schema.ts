import {z} from 'zod';

 export const messageSchema = z.object({
    content : z.string()
                .min(10, {message: "Message should have atleast 10 chars"})
                .max(500, {message: "Message can have atmost 500 chars"})
})
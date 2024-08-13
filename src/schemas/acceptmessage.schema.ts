import {z} from 'zod';

 export const acceptmessageSchema = z.object({
    acceptMessages : z.boolean({message: "Accept Message value must be either true or false"}),    
})
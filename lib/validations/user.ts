import { z } from "zod";


export const formSchema = z.object({
    profile_image: z.string().url().nonempty(),
    username: z.string().min(3).max(30),
    name: z.string().min(3).max(30),
    bio: z.string().max(1000),
})


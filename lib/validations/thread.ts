import { z } from "zod";


export const ThreadValidation = z.object({
    thread:z.string().min(3,{message:"Minimum 3 characters"}),
    accountId:z.string(),
})


export const CommentValidation = z.object({
    thread:z.string().min(3,{message:"Minimum 3 characters"}),
})


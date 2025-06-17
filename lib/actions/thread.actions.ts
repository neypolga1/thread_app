"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";



interface Params {
    text:string,
    communityId:string | null,
    author:string,
    path:string,
}

export async function createThread({text,communityId,author,path}:Params){
        await connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community:null,
            path
        })

        await User.findByIdAndUpdate(author,{$push:{threads:createdThread._id}})
        revalidatePath(path)

}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    await connectToDB();

    // calculate the number of posts to skip
    const skipAmount = (pageNumber - 1 ) * pageSize;


    // fetch posts that have no parents (top-level threads ....)
    const postsQuery = await Thread.find({parentId:{$in:[null,undefined]}})
    .sort({createdAt : 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path:'author',model:User})
    .populate({
        path:"children",
        populate:{
            path:"author",
            model:User,
            select:"id name image parentId"
        }
    })

    const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null,undefined]}})

    const posts = postsQuery;
    const isNext = totalPostsCount > skipAmount + posts.length;

    return {posts,isNext}

}

export async function fetchThreadById(id:string){
    try{
        connectToDB();
        const thread =   await Thread.findById(id).populate({
            path:"author",
            model:User,
            select:"_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:"author",
                    model:User,
                    select:"_id id parentId name image"
                },
                {
                    path:"children",
                    model:Thread,
                    populate:{
                        path:"author",
                        model:User,
                        select:"_id id parentId name image"
                    }
                }
            ]
        }).exec();
        return thread;
    }catch(error:any){
        throw new Error(`Error fetching user: ${error.message}`);
    }   
}

export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path:string
)
{
    await connectToDB();
    try {
        // find Original Thread:
        const originalThread = await Thread.findById(threadId);
        if(!originalThread){
            throw new Error("Thread not found.");
        };

        // create a new thread with the comment text:
        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        });

        // save the Cmment thread:
        const savedCommentThread = await commentThread.save();

        // update original thread with the new Comment : 
        await originalThread.children.push(savedCommentThread._id);

        // save the original thread:
        await originalThread.save()

        revalidatePath(path)
        
    } catch (error:any) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}
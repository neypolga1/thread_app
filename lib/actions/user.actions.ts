'use server'

import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { revalidatePath } from 'next/cache';


interface Params {
    userId: string; // User ID from Clerk
    username: string; // Username
    name: string; // Name
    bio: string; // Bio
    image: string; // Image URL
    path: string; // Optional path, not used in this function
}

export async function updateUser({userId,username,name,bio,image,path}:Params){
    connectToDB();
    try {
        await User.findOneAndUpdate(
        {id:userId},
        {
            username:username.toLowerCase(),
            name:name,
            bio:bio,
            image:image,
            onboarded:true
        },
        {upsert:true}
    )
    if(path === '/profile/edit'){
        revalidatePath(path);
    }
    } catch (error:any) {
        throw new Error(`Error updating or creating user: ${error.message}`);
    }
}

export async function fetchUser(userId:string){
    try{
        await connectToDB();
        return  await User.findOne({id:userId});
    }catch(error:any){
        throw new Error(`Error fetching user: ${error.message}`);
    }
}


export async function fetchUserPost(userId:string){
    try {
        await connectToDB();
        // find all threads authored by user with the given id:
        const threads = await User.findOne({id:userId})
        .populate({
            path:'threads',
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'id name image '
                }
            }
        })
        return threads;
    } catch (error:any) {
        throw new Error(`Error failed to fetch user pots: ${error.message}`);
    }
}

export async function fetchUsers({userId,pageNumber = 1,pageSize = 20,searchString = "",sortBy = "desc"}:{userId:string,pageNumber?:number,pageSize?:number,searchString?:string,sortBy?:SortOrder}){
    try {
        await connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {id :{$ne : userId}}

        if(searchString.trim() !== ""){
            query.$or = [
                {
                    username:{$regex:regex},
                    name:{$regex:regex}
                }
            ]
        }

        const sortOption = {createdAt : sortBy};

        const usersQuery = await User.find(query).sort(sortOption).skip(skipAmount).limit(pageSize);

        const totalUsers = await User.countDocuments(query);

        const users = usersQuery; 

        const isNext = totalUsers > skipAmount + users.length;

        return {users,isNext}

    } catch (error:any) {
        throw new Error(`Error failed to fetch user pots: ${error.message}`);
    }
}

export async function getActivity(userId:string){
    try {
        await connectToDB();

        const userThreads = await Thread.find({author : userId})

        const childThreadIds = userThreads.reduce((acc,userThread) =>{
            return acc.concat(userThread.children);
        },[])

        const replies = await Thread.find({
            _id : {$in : childThreadIds},
            author: {$ne : userId}
        }).populate({
            path:'author',
            model:User,
            select:'name image name'
        })

        return replies;

    } catch (error:any) {
        throw new Error(`Error failed to fetch user pots: ${error.message}`);
    }
}
import { fetchUserPost } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../card/ThreadCard"

interface Props{
    accountId:string
    currentUserId:string
    accountType:string
}

const ThreadsTab = async ({accountId,currentUserId,accountType}:Props) => {
    let result = await fetchUserPost(accountId);
    if(!result) redirect("/");


  return (
    <section className="mt-9 flex flex-col gap-10">
        {result.threads.map((thread:any) => (
            <ThreadCard
					key={thread._id}
					id={thread._id}
					currentUserId={currentUserId}
					author={accountType === 'User' ? {name:result.name,image:result.image,id:result.id} : {name:thread.author.name,image:thread.author.image,id:thread.author.id}}
					community={thread.community}
					content={thread.text}
					parentId={thread.parentId}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
        ))}
    </section>
  )
}

export default ThreadsTab
import ThreadCard from "@/components/card/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Comment from "@/components/form/Comment"
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
    const {id} = await params;
	if (!id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect("/onboarding");

	const thread = await fetchThreadById(id);


	return (
		<section className="relative">
			<div>
				<ThreadCard
					id={thread._id}
					currentUserId={userInfo?.id}
					author={thread.author}
					community={thread.community}
					content={thread.text}
					parentId={thread.parentId}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			</div>
            <div className="mt-7">
                <Comment threadId={thread.id} currentUserImg={userInfo.image} currentUserId={JSON.stringify(userInfo._id)}/>
            </div>
            <div className="mt-10">
                {thread.children.map((childItem:any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={userInfo?.id}
                        author={childItem.author}
                        community={childItem.community}
                        content={childItem.text}
                        parentId={childItem.parentId}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment={true}
				    />
                ))}
            </div>
		</section>
	);
};

export default Page;

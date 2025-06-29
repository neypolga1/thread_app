"use client";

import { CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
  

	const form = useForm<z.infer<typeof CommentValidation>>({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToThread(threadId,values.thread,JSON.parse(currentUserId),pathname)

		form.reset();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="comment-form"
			>
				<FormField
					control={form.control}
					name="thread"
					render={({ field }) => (
						<FormItem className="flex items-center gap-3 w-full">
							<FormLabel>
								<Image src={currentUserImg} alt="user-image" width={48} height={48} className="rounded-full object-cover"/>
							</FormLabel>
							<FormControl className="border-none bg-transparent">
								<Input type="text" placeholder="Comment ..." {...field} className="no-focus text-light-1 outline-none"/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit" className="comment-form_btn">
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;

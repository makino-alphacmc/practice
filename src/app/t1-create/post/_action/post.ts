"use server";

import { createPostSchema } from "../_schema/post";
import { createPost } from "../_repository/postRepository";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createPostAction(formData: FormData) {
	const rawData = {
		title: formData.get("title") as string,
		body: formData.get("body") as string,
		category: formData.get("category") as string,
		authorId: parseInt(formData.get("authorId") as string),
	};

	const validatedData = createPostSchema.parse(rawData);

	await createPost(validatedData);

	revalidateTag("posts");

	redirect("/t2-read-list/posts");
}

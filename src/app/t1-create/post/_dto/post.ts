import { PostCategory } from "@prisma/client";

export type Post = {
	id: number;
	title: string;
	body: string;
	category: PostCategory;
	authorId: number;
	createdAt: Date;
};

export type PostListItem = Pick<Post, "id" | "title" | "createdAt">;

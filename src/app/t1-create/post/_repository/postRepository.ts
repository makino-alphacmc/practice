import { prisma } from "@/lib/prisma";
import type { Post } from "../_dto/post";
import type { CreatePostInput } from "../_schema/post";

export async function createPost(data: CreatePostInput): Promise<Post> {
	const post = await prisma.$queryRaw<Post[]>`
    INSERT INTO "posts" (title, body, category, author_id, created_at)
    VALUES(${data.title}, ${data.body}, ${data.category}, ${data.authorId}, NOW())
    RETURNING id, title, body, category, author_id as "authorId", created_at as "createdAt"
  `;

	return post[0];
}

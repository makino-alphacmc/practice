import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Post } from "../_dto/post";
// ↑ 型定義をインポート（型安全性のため）

import type { CreatePostInput } from "../_schema/post";
// ↑ スキーマの型定義をインポート

// 投稿作成関数
export async function createPost(data: CreatePostInput): Promise<Post> {
	// ↑ 非同期関数、戻り値はPost

	const post = await prisma.$queryRaw<Post[]>`
    INSERT INTO "posts" (title, body, category, author_id, created_at)
    VALUES (${data.title}, ${data.body}, ${data.category}, ${data.authorId}, NOW())
    RETURNING id, title, body, category, author_id as "authorId", created_at as "createdAt"
  `;

	return post[0];
	// ↑ 作成された投稿を返す
}

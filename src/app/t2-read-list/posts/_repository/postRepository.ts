import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Post, PostListItem } from "../_dto/post";
// ↑ 型定義をインポート（型安全性のため）

import type { CreatePostInput } from "../_schema/post";
// ↑ スキーマの型定義をインポート

// 投稿一覧取得関数
export async function getPostList(): Promise<PostListItem[]> {
	// ↑ 非同期関数、戻り値はPostListItemの配列

	const posts = await prisma.$queryRaw<PostListItem[]>`
    SELECT id, title, created_at as "createdAt"
    FROM "posts" 
    ORDER BY created_at DESC
  `;

	return posts;
	// ↑ 取得したデータを返す
}

// 投稿詳細取得関数
export async function getPostById(id: number): Promise<Post | null> {
	// ↑ 非同期関数、戻り値はPostまたはnull

	const post = await prisma.$queryRaw<Post[]>`
    SELECT id, title, body, category, author_id as "authorId", created_at as "createdAt"
    FROM "posts" 
    WHERE id = ${id}
  `;

	return post[0] || null;
	// ↑ 配列の最初の要素を返す、なければnull
	// ↑ || null でundefinedをnullに変換
}

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

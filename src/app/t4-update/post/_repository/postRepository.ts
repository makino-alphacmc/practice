import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Post } from "../_dto/post";
// ↑ 型定義をインポート（型安全性のため）

import type { UpdatePostInput } from "../_schema/post";
// ↑ スキーマの型定義をインポート

// 投稿取得関数（更新用）
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

// 投稿更新関数
export async function updatePost(data: UpdatePostInput): Promise<Post> {
	// ↑ 非同期関数、戻り値はPost

	const post = await prisma.$queryRaw<Post[]>`
    UPDATE "posts" 
    SET title = ${data.title}, 
        body = ${data.body}, 
        category = ${data.category}, 
        author_id = ${data.authorId}
    WHERE id = ${data.id}
    RETURNING id, title, body, category, author_id as "authorId", created_at as "createdAt"
  `;

	return post[0];
	// ↑ 更新された投稿を返す
}

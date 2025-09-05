import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Post } from "../_dto/post";
// ↑ 型定義をインポート（型安全性のため）

import type { DeletePostInput } from "../_schema/post";
// ↑ スキーマの型定義をインポート

// 投稿取得関数（削除確認用）
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

// 投稿削除関数
export async function deletePost(data: DeletePostInput): Promise<void> {
	// ↑ 非同期関数、戻り値はvoid

	await prisma.$queryRaw`
    DELETE FROM "posts" 
    WHERE id = ${data.id}
  `;
	// ↑ 投稿を削除
}

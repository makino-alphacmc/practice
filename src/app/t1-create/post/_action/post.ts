"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createPostSchema, type CreatePostInput } from "../_schema/post";
import { createPost } from "../_repository/postRepository";

// アクションの結果型
export type ActionResult = {
	success: boolean;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

// 投稿作成アクション
export async function createPostAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		title: formData.get("title") as string,
		body: formData.get("body") as string,
		category: formData.get("category") as string,
		authorId: parseInt(formData.get("authorId") as string),
	};

	// バリデーション実行
	const validatedData = createPostSchema.parse(rawData);

	// データベースに保存
	await createPost(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("posts");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/posts");
}

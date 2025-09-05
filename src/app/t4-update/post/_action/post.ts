"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { updatePostSchema, type UpdatePostInput } from "../_schema/post";
import { updatePost } from "../_repository/postRepository";

// 投稿更新アクション
export async function updatePostAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
		title: formData.get("title") as string,
		body: formData.get("body") as string,
		category: formData.get("category") as string,
		authorId: parseInt(formData.get("authorId") as string),
	};

	// バリデーション実行
	const validatedData = updatePostSchema.parse(rawData);

	// データベースを更新
	await updatePost(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("posts");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/posts");
}

"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { deletePostSchema, type DeletePostInput } from "../_schema/post";
import { deletePost } from "../_repository/postRepository";

// 投稿削除アクション
export async function deletePostAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
	};

	// バリデーション実行
	const validatedData = deletePostSchema.parse(rawData);

	// データベースから削除
	await deletePost(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("posts");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/posts");
}

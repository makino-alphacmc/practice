import { z } from "zod";

// 更新用のスキーマ
export const updatePostSchema = z.object({
	id: z
		.number()
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	body: z
		.string()
		.min(1, "本文は必須です")
		.max(5000, "本文は5000文字以内で入力してください"),
	category: z
		.string()
		.min(1, "カテゴリは必須です")
		.max(50, "カテゴリは50文字以内で入力してください"),
	authorId: z
		.number()
		.int("著者IDは整数で入力してください")
		.positive("著者IDは正の数で入力してください"),
});

// 型推論用
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

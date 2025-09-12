import { z } from "zod";
import { PostCategory } from "@prisma/client";

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
	category: z.nativeEnum(PostCategory, {
		errorMap: () => ({ message: "有効なカテゴリを選択してください" }),
	}),
	authorId: z
		.number()
		.int("著者IDは整数で入力してください")
		.positive("著者IDは正の数で入力してください"),
});

// 型推論用
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

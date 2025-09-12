import { z } from "zod";
import { PostCategory } from "@prisma/client";

export const createPostSchema = z.object({
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

export type CreatePostInput = z.infer<typeof createPostSchema>;

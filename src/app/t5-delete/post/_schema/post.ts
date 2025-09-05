import { z } from "zod";

// 削除用のスキーマ
export const deletePostSchema = z.object({
	id: z
		.number()
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
});

// 型推論用
export type DeletePostInput = z.infer<typeof deletePostSchema>;

import { z } from "zod";

export const createProductSchema = z.object({
	name: z
		.string()
		.min(1, "商品名は必須です")
		.max(100, "商品名は100文字以内で入力してください"),
	category: z
		.string()
		.min(1, "カテゴリは必須です")
		.max(50, "カテゴリは50文字以内で入力してください"),
	price: z.number().positive("価格は正の数で入力してください"),
	stock: z
		.number()
		.int("在庫数は整数で入力してください")
		.min(0, "在庫数は0以上で入力してください"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

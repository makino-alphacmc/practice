import { z } from "zod";
import { ProductCategory } from "@prisma/client";

export const createProductSchema = z.object({
	name: z
		.string()
		.min(1, "商品名は必須です")
		.max(100, "商品名は100文字以内で入力してください"),
	category: z.nativeEnum(ProductCategory, {
		errorMap: () => ({ message: "有効なカテゴリを選択してください" }),
	}),
	price: z.number().positive("価格は正の数で入力してください"),
	stock: z
		.number()
		.int("在庫数は整数で入力してください")
		.min(0, "在庫数は0以上で入力してください"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

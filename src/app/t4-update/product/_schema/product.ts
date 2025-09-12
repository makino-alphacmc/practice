import { z } from "zod";
import { ProductCategory } from "@prisma/client";

export const updateProductSchema = z.object({
	id: z
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
	name: z
		.string()
		.min(1, "名前は必須です")
		.max(100, "名前は100文字以内で入力してください"),
	category: z.nativeEnum(ProductCategory, {
		errorMap: () => ({ message: "有効なカテゴリを選択してください" }),
	}),
	price: z.number().min(0, "価格は0以上で入力してください"),
	stock: z
		.int("在庫数は整数で入力してください")
		.min(0, "在庫数は0以上で入力してください"),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

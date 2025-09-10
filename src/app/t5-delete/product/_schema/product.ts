import { z } from "zod";

export const deleteProductSchema = z.object({
	id: z
		.number()
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
});

export type DeleteProductInput = z.infer<typeof deleteProductSchema>;

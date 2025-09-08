"use server";

import { createProductSchema } from "../_schema/product";
import { createProduct } from "../_repository/productRepository";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData) {
	const rawData = {
		name: formData.get("name") as string,
		category: formData.get("category") as string,
		price: parseFloat(formData.get("price") as string),
		stock: parseInt(formData.get("stock") as string),
	};

	const validatedData = createProductSchema.parse(rawData);

	await createProduct(validatedData);

	revalidateTag("products");

	redirect("/t2-read-list/products");
}

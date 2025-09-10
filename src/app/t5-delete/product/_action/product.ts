"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
	deleteProductSchema,
	type DeleteProductInput,
} from "../_schema/product";
import { deleteProduct } from "../_repository/productRepository";

export async function deleteProductAction(formData: FormData) {
	const rawData = {
		id: parseInt(formData.get("id") as string),
	};

	const validatedData = deleteProductSchema.parse(rawData);

	await deleteProduct(validatedData);

	revalidateTag("products");

	redirect("/t2-read-list/products");
}

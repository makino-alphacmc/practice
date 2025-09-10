import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { DeleteProductInput } from "../_schema/product";

export async function getProductById(id: number): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
		SELECT id, name, category, price, stock, created_at as "createdAt"
		FROM "products"
		WHERE id = ${id}
	`;

	return product[0] || null;
}

export async function deleteProduct(
	data: DeleteProductInput
): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
    DELETE FROM "products"
    WHERE id = ${data.id}
    RETURNING id, name, category, price, stock, created_at as "createdAt"
  `;

	return product[0] || null;
}

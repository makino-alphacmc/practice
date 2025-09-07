import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { UpdateProductInput } from "../_schema/product";

export async function getProductById(id: number) {
	const product = await prisma.$queryRaw<Product[]>`
  SELECT
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  FROM
    "products"
  WHERE
    id = ${id}
  `;

	return product[0] || null;
}

export async function updateProduct(data: UpdateProductInput) {
	const product = await prisma.$queryRaw<Product[]>`
  UPDATE "products"
  SET
    name = ${data.name},
    category = ${data.category},
    price = ${data.price},
    stock = ${data.stock}
  WHERE id = ${data.id}
  RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  `;

	return product[0];
}

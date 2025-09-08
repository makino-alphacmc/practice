import { createProductSchema } from "./../_schema/product";
import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { CreateProductInput } from "../_schema/product";

export async function createProduct(
	data: CreateProductInput
): Promise<Product> {
	const product = await prisma.$queryRaw<Product[]>`
  INSERT INTO "products" (name, category, price, stock, created_at)
  VALUES(${data.name}, ${data.category}, ${data.price}, ${data.stock}, NOW())
  RETURNING id, name, category, price, stock, created_at as "createdAt"
  `;

	return product[0];
}

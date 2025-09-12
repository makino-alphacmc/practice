import { ProductCategory } from "@prisma/client";

export type Product = {
	id: number;
	name: string;
	category: ProductCategory;
	price: number;
	stock: number;
	createdAt: Date;
};

export type ProductListItem = Pick<Product, "id" | "name" | "createdAt">;

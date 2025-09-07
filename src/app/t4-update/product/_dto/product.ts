export type Product = {
	id: number;
	name: string;
	category: string;
	price: number;
	stock: number;
	createdAt: Date;
};

export type ProductListItem = Pick<Product, "id" | "name" | "createdAt">;

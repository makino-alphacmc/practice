import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Product, ProductListItem } from "../_dto/product";
// ↑ 型定義をインポート（型安全性のため）

// 商品一覧取得関数
export async function getProductList(): Promise<ProductListItem[]> {
	// ↑ 非同期関数、戻り値はProductListItemの配列

	const products = await prisma.$queryRaw<ProductListItem[]>`
    SELECT id, name, created_at as "createdAt"
    FROM "products" 
    ORDER BY created_at DESC
  `;

	return products;
	// ↑ 取得したデータを返す
}

// 商品詳細取得関数
export async function getProductById(id: number): Promise<Product | null> {
	// ↑ 非同期関数、戻り値はProductまたはnull

	const product = await prisma.$queryRaw<Product[]>`
    SELECT id, name, category, price, stock, created_at as "createdAt"
    FROM "products" 
    WHERE id = ${id}
  `;

	return product[0] || null;
	// ↑ 配列の最初の要素を返す、なければnull
	// ↑ || null でundefinedをnullに変換
}

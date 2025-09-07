// 商品データの完全な型定義
export type Product = {
	id: number; // 商品ID（主キー）
	name: string; // 商品名
	category: string; // カテゴリ
	price: number; // 価格
	stock: number; // 在庫数
	createdAt: Date; // 作成日時
};

// 一覧表示用の軽量型（パフォーマンス向上のため）
export type ProductListItem = Pick<Product, "id" | "name" | "createdAt">;
// ↑ Product型から id, name, createdAt のみを抽出

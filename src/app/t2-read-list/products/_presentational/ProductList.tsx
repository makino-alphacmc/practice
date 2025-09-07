import { ProductCard } from "./ProductCard";
// ↑ ProductCardコンポーネントをインポート

import type { ProductListItem } from "../_dto/product";
// ↑ 型定義をインポート

type ProductListProps = {
	products: ProductListItem[]; // プロパティの型定義
};

export function ProductList({ products }: ProductListProps) {
	// ↑ 関数コンポーネント、products配列を受け取る

	if (products.length === 0) {
		// ↑ 商品が0件の場合の処理

		return (
			<div className="text-center py-16">
				{/* ↑ 中央揃え、上下にpadding 16 */}
				<div className="max-w-md mx-auto">
					<div className="text-6xl mb-4">🛍️</div>
					<h3 className="text-xl font-semibold mb-2 text-foreground">
						商品がありません
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						まだ商品が追加されていません。
						<br />
						新しい商品を追加して、商品リストを充実させましょう。
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/* ↑ グリッドレイアウト */}
			{/* ↑ gap-6: グリッドアイテム間の間隔 */}
			{/* ↑ md:grid-cols-2: 中サイズ以上で2列 */}
			{/* ↑ lg:grid-cols-3: 大サイズ以上で3列 */}
			{products.map((product) => (
				// ↑ products配列をmapでループ処理

				<ProductCard key={product.id} product={product} />
				// ↑ ProductCardコンポーネントをレンダリング
				// ↑ key={product.id}: Reactのkey属性（パフォーマンス最適化）
				// ↑ product={product}: 各商品データを渡す
			))}
		</div>
	);
}

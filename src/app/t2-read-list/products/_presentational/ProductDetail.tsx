import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのCardコンポーネント群

import type { Product } from "../_dto/product";
// ↑ 型定義をインポート

type ProductDetailProps = {
	product: Product; // プロパティの型定義
};

export function ProductDetail({ product }: ProductDetailProps) {
	// ↑ 関数コンポーネント、productを受け取る

	return (
		<Card className="max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
			{/* ↑ Cardコンポーネント */}
			{/* ↑ max-w-4xl: 最大幅を4xlに設定 */}
			{/* ↑ mx-auto: 左右のマージンを自動（中央揃え） */}
			<CardHeader className="pb-6">
				{/* ↑ カードヘッダー */}
				<div className="flex items-center gap-2 mb-2">
					<span className="text-2xl">🛍️</span>
					<span className="text-sm text-primary font-medium">商品詳細</span>
				</div>
				<CardTitle className="text-3xl font-bold leading-tight">
					{product.name}
				</CardTitle>
				{/* ↑ カードタイトル、フォントサイズ3xl */}
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					{/* ↑ 段落要素、薄い色 */}
					<span>📅 {product.createdAt.toLocaleDateString("ja-JP")}</span>
					<span>🏷️ {product.category}</span>
					<span>💰 ¥{product.price.toLocaleString()}</span>
					<span>📦 在庫: {product.stock}個</span>
				</div>
			</CardHeader>
			<CardContent>
				{/* ↑ カードコンテンツ */}
				<div className="prose prose-invert max-w-none prose-lg">
					{/* ↑ prose: リッチテキスト用のスタイル */}
					{/* ↑ prose-invert: ダークテーマ用のprose */}
					{/* ↑ max-w-none: 最大幅制限を解除 */}
					{/* ↑ prose-lg: 大きなフォントサイズ */}
					<div className="bg-muted/30 rounded-lg p-6 border border-border/30">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold mb-2 text-foreground">
									商品情報
								</h3>
								<div className="space-y-2 text-foreground">
									<p>
										<span className="font-medium">商品名:</span> {product.name}
									</p>
									<p>
										<span className="font-medium">カテゴリ:</span>{" "}
										{product.category}
									</p>
									<p>
										<span className="font-medium">価格:</span> ¥
										{product.price.toLocaleString()}
									</p>
									<p>
										<span className="font-medium">在庫数:</span> {product.stock}
										個
									</p>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2 text-foreground">
									在庫状況
								</h3>
								<div
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
										product.stock > 20
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											: product.stock > 5
											? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
									}`}
								>
									{product.stock > 20
										? "在庫十分"
										: product.stock > 5
										? "在庫少"
										: "在庫切れ"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

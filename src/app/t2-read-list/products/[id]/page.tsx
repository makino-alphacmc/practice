import { notFound } from "next/navigation";
// ↑ Next.jsのnotFound関数（404ページ表示用）
import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { getProductById } from "../_repository/productRepository";
// ↑ Repository層の関数をインポート

import { ProductDetail } from "../_presentational/ProductDetail";
// ↑ Presentational層のコンポーネントをインポート

type ProductDetailPageProps = {
	params: Promise<{ id: string }>; // プロパティの型定義
	// ↑ paramsは非同期で取得される（App Routerの仕様）
};

export default async function ProductDetailPage({
	params,
}: ProductDetailPageProps) {
	// ↑ デフォルトエクスポートの非同期関数
	// ↑ Server Component（サーバーサイドで実行）

	const { id } = await params;
	// ↑ paramsからidを取得（非同期処理）

	const productId = parseInt(id);
	// ↑ 文字列のidを数値に変換

	if (isNaN(productId)) {
		// ↑ 数値変換に失敗した場合（無効なID）
		notFound();
		// ↑ 404ページを表示
	}

	const product = await getProductById(productId);
	// ↑ Repository層でデータ取得

	if (!product) {
		// ↑ 商品が存在しない場合
		notFound();
		// ↑ 404ページを表示
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* ↑ コンテナ要素（一覧ページと同じスタイル） */}

				{/* 戻るボタン */}
				<div className="mb-6">
					<Link
						href="/t2-read-list/products"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 商品リストに戻る
					</Link>
				</div>

				<ProductDetail product={product} />
				{/* ↑ ProductDetailコンポーネントにproductデータを渡す */}
			</div>
		</div>
	);
}

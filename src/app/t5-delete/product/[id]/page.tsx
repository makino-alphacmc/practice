import { notFound } from "next/navigation";
// ↑ 404ページ表示のため
import Link from "next/link";
// ↑ リンクコンポーネントのため

import { getProductById } from "../_repository/productRepository";
// ↑ 商品取得関数をインポート
import { ProductDeleteDialog } from "../_presentational/ProductDeleteDialog";
// ↑ 商品削除ダイアログコンポーネントをインポート

type ProductDeletePageProps = {
	params: Promise<{ id: string }>; // URLパラメータの型定義
};

export default async function ProductDeletePage({
	params,
}: ProductDeletePageProps) {
	// ↑ 商品削除ページコンポーネント（Server Component）
	// ↑ URLパラメータを受け取る

	const { id } = await params;
	// ↑ パラメータから商品IDを取得（非同期で待機）
	const productId = parseInt(id);
	// ↑ 文字列のIDを整数に変換

	if (isNaN(productId)) {
		// ↑ IDが数値でない場合
		notFound();
		// ↑ 404ページを表示
	}

	const product = await getProductById(productId);
	// ↑ データベースから商品データを取得

	if (!product) {
		// ↑ 商品が見つからない場合
		notFound();
		// ↑ 404ページを表示
	}

	return (
		<div className="min-h-screen bg-background">
			{/* ↑ 最小高さ画面、背景色 */}
			<div className="container mx-auto px-4 py-8">
				{/* ↑ コンテナ、中央配置、横パディング4、縦パディング8 */}

				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					{/* ↑ ヘッダー、下マージン12、中央配置 */}
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
						{/* ↑ メインタイトル、4xlサイズ、太字、下マージン4、削除色のグラデーション */}
						🗑️ T5. Delete（削除）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						{/* ↑ 説明文、薄い色、lgサイズ、最大幅2xl、中央配置、行間広め */}
						商品を削除しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							{/* ↑ 補足説明、小さい文字、より薄い色 */}
							削除する前に内容を確認してください
						</span>
					</p>
				</div>

				{/* 戻るボタン */}
				<div className="mb-6">
					{/* ↑ 戻るボタンエリア、下マージン6 */}
					<Link
						href="/t2-read-list/products"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						{/* ↑ 商品一覧へのリンク、インラインフレックス、アイテム中央、小さい文字、薄い色、ホバーでプライマリ色、色変化アニメーション */}
						← 商品リストに戻る
					</Link>
				</div>

				{/* 削除確認ダイアログ */}
				<ProductDeleteDialog product={product} />
				{/* ↑ 商品削除ダイアログ、商品データを渡す */}
			</div>
		</div>
	);
}

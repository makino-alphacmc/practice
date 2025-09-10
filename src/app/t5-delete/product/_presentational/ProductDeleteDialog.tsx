"use client";

import { Button } from "@/components/ui/button";
// ↑ shadcn/uiのボタンコンポーネント
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのカードコンポーネント

import { deleteProductAction } from "../_action/product";
// ↑ 商品削除アクションをインポート
import type { Product } from "../_dto/product";
// ↑ 商品の型定義をインポート
import Link from "next/link";

type ProductDeleteDialogProps = {
	product: Product; // 削除対象の商品データ
};

export function ProductDeleteDialog({ product }: ProductDeleteDialogProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			{/* ↑ カードコンテナ、最大幅2xl、中央配置 */}
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-destructive">
					{/* ↑ カードタイトル、2xlサイズ、太字、削除色 */}
					🗑️ 商品を削除
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* ↑ カードの内容部分 */}
				<div className="space-y-6">
					{/* ↑ 子要素間に6の余白を設定 */}

					{/* 削除対象の商品情報 */}
					<div className="p-4 bg-muted/50 rounded-lg border">
						{/* ↑ 商品情報表示エリア、パディング4、薄い背景、角丸、ボーダー */}
						<h3 className="font-semibold mb-2">削除対象の商品</h3>
						{/* ↑ 見出し、セミボールド、下マージン2 */}
						<div className="space-y-2 text-sm">
							{/* ↑ 商品詳細、要素間余白2、小さい文字 */}
							<p>
								<span className="font-medium">ID:</span> {product.id}
								{/* ↑ 商品ID表示、IDラベルは太字 */}
							</p>
							<p>
								<span className="font-medium">商品名:</span> {product.name}
								{/* ↑ 商品名表示、ラベルは太字 */}
							</p>
							<p>
								<span className="font-medium">カテゴリ:</span>{" "}
								{product.category}
								{/* ↑ カテゴリ表示、ラベルは太字 */}
							</p>
							<p>
								<span className="font-medium">価格:</span> ¥
								{product.price.toLocaleString()}
								{/* ↑ 価格表示、カンマ区切りでフォーマット */}
							</p>
							<p>
								<span className="font-medium">在庫数:</span> {product.stock}
								{/* ↑ 在庫数表示、ラベルは太字 */}
							</p>
							<p>
								<span className="font-medium">作成日:</span>{" "}
								{product.createdAt.toLocaleDateString("ja-JP")}
								{/* ↑ 作成日表示、日本語形式でフォーマット */}
							</p>
						</div>
					</div>

					{/* 警告メッセージ */}
					<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
						{/* ↑ 警告エリア、削除色の薄い背景、削除色のボーダー、角丸 */}
						<p className="text-destructive font-medium">
							{/* ↑ 警告テキスト、削除色、中太字 */}
							⚠️ この操作は取り消せません
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							{/* ↑ 説明テキスト、小さい文字、薄い色、上マージン1 */}
							商品を削除すると、すべてのデータが完全に削除されます。
						</p>
					</div>

					{/* 削除ボタン */}
					<form action={deleteProductAction}>
						{/* ↑ 削除フォーム、Server Actionを実行 */}
						<input type="hidden" name="id" value={product.id} />
						{/* ↑ 隠しフィールドで商品IDを送信 */}
						<Button type="submit" variant="destructive" className="w-full">
							{/* ↑ 削除ボタン、送信タイプ、削除バリアント、全幅 */}
							商品を削除する
						</Button>
					</form>

					{/* 戻るボタン */}
					<Button variant="outline" asChild className="w-full">
						{/* ↑ キャンセルボタン、アウトライン、子要素として、全幅 */}
						<Link href="/t2-read-list/products">キャンセル</Link>
						{/* ↑ 商品一覧ページへのリンク */}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

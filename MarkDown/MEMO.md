# 🗑️ T5. Delete（削除）- 商品削除機能

## goal_image

商品削除確認画面が中央に表示され、削除対象の商品情報と警告メッセージ、削除ボタンが配置される

## what_you_learn

- **Server Actions** / **App Router** / **DB 削除操作**
- 使用する主要 shadcn/ui コンポーネント + Tailwind クラス: `Card`, `Button`, `Alert` + `container`, `mx-auto`, `space-y-6`, `bg-destructive/10`, `text-destructive`
- ダークテーマ最適化のスタイリング指針: 削除操作の危険性を視覚的に表現

## file_structure

```
practice/src/app/t5-delete/product/
├── _dto/
│   └── product.ts # 商品DTO
├── _presentational/
│   └── ProductDeleteDialog.tsx # 商品削除確認ダイアログ
├── _repository/
│   └── productRepository.ts # 商品のDBアクセス
├── _action/
│   └── product.ts # 商品削除アクション
├── _schema/
│   └── product.ts # 商品削除バリデーションスキーマ
└── [id]/
    └── page.tsx # 商品削除ページ
```

## db_schema

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  category  String
  price     Float
  stock     Int
  createdAt DateTime @default(now())
}
```

## step_by_step_explanation（Phase 1）

**処理の流れ図解:**

```
1. URLパラメータから商品ID取得 → 2. 商品データ取得 → 3. 削除確認画面表示
4. 削除ボタンクリック → 5. Server Action実行 → 6. DB削除 → 7. 一覧ページリダイレクト
```

**各ステップの目的:**

- **DTO**: 商品データの型定義（削除対象の情報を型安全に扱う）
- **Repository**: DB から商品取得・削除（query raw で SQL 実行）
- **Schema**: 削除用バリデーション（ID の妥当性チェック）
- **Action**: 削除処理のビジネスロジック（バリデーション → 削除 → リダイレクト）
- **Presentational**: 削除確認 UI（危険性を視覚的に表現）
- **Page**: 削除ページのルーティング（ID 取得 → データ取得 →UI 表示）

**shadcn/ui + Tailwind 使用根拠:**

- `Card` = 削除確認のコンテナ表示
- `Button` = 削除・キャンセル操作
- `space-y-6` = 要素間の適切な余白
- `bg-destructive/10` = 削除の危険性を背景色で表現
- `text-destructive` = 削除ボタンの警告色

## full_code_with_comment（Phase 1）

### \_dto/product.ts

```typescript
// 商品データの完全な型定義
export type Product = {
	id: number; // 商品ID（主キー）
	name: string; // 商品名
	category: string; // カテゴリ
	price: number; // 価格
	stock: number; // 在庫数
	createdAt: Date; // 作成日時
};
```

### \_schema/product.ts

```typescript
import { z } from "zod";

// 削除用のスキーマ
export const deleteProductSchema = z.object({
	id: z
		.number()
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
});

// 型推論用
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
```

### \_repository/productRepository.ts

```typescript
import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Product } from "../_dto/product";
// ↑ 型定義をインポート（型安全性のため）

import type { DeleteProductInput } from "../_schema/product";
// ↑ スキーマの型定義をインポート

// 商品取得関数（削除確認用）
export async function getProductById(id: number): Promise<Product | null> {
	// ↑ 非同期関数、戻り値はProductまたはnull

	const product = await prisma.$queryRaw<Product[]>`
    SELECT id, name, category, price, stock, created_at as "createdAt"
    FROM "products" 
    WHERE id = ${id}
  `;
	// ↑ query rawで生SQLを実行、商品IDで検索
	// ↑ created_atをcreatedAtにエイリアス（JavaScriptの命名規則に合わせる）

	return product[0] || null;
	// ↑ 配列の最初の要素を返す、なければnull
	// ↑ || null でundefinedをnullに変換
}

// 商品削除関数
export async function deleteProduct(data: DeleteProductInput): Promise<void> {
	// ↑ 非同期関数、戻り値はvoid

	await prisma.$queryRaw`
    DELETE FROM "products" 
    WHERE id = ${data.id}
  `;
	// ↑ 商品を削除
}
```

### \_action/product.ts

```typescript
"use server";

import { revalidateTag } from "next/cache";
// ↑ キャッシュ無効化のため
import { redirect } from "next/navigation";
// ↑ リダイレクトのため

import {
	deleteProductSchema,
	type DeleteProductInput,
} from "../_schema/product";
// ↑ バリデーションスキーマと型定義をインポート
import { deleteProduct } from "../_repository/productRepository";
// ↑ 商品削除関数をインポート

// 商品削除アクション
export async function deleteProductAction(formData: FormData) {
	// ↑ Server Action関数（"use server"でサーバー側実行）
	// ↑ FormDataを受け取る（フォームから送信されたデータ）

	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
		// ↑ フォームからIDを取得して整数に変換
	};

	// バリデーション実行
	const validatedData = deleteProductSchema.parse(rawData);
	// ↑ Zodスキーマでデータの妥当性をチェック
	// ↑ エラーがあれば例外が発生

	// データベースから削除
	await deleteProduct(validatedData);
	// ↑ バリデーション済みデータで商品を削除

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");
	// ↑ "products"タグのキャッシュを無効化
	// ↑ 一覧ページのデータが最新になる

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
	// ↑ 商品一覧ページに自動遷移
}
```

### \_presentational/ProductDeleteDialog.tsx

```typescript
"use client";

import { Button } from "@/components/ui/button";
// ↑ shadcn/uiのボタンコンポーネント
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのカードコンポーネント

import { deleteProductAction } from "../_action/product";
// ↑ 商品削除アクションをインポート
import type { Product } from "../_dto/product";
// ↑ 商品の型定義をインポート

type ProductDeleteDialogProps = {
	product: Product; // 削除対象の商品データ
};

export function ProductDeleteDialog({ product }: ProductDeleteDialogProps) {
	// ↑ 商品削除確認ダイアログコンポーネント
	// ↑ 削除対象の商品データを受け取る

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
						<a href="/t2-read-list/products">キャンセル</a>
						{/* ↑ 商品一覧ページへのリンク */}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
```

### [id]/page.tsx

```typescript
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

export default async function ProductDeletePage({ params }: ProductDeletePageProps) {
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
						{/* ↑ 商品一覧へのリンク、インラインフレックス、アイテム中央、小さい文字、薄い色、ホバーでプライマリ色、色変化アニメーション */}
					>
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
```

## self_challenge_instruction（Phase 2）

**実装手順のみ（1 行ずつ）:**

1. 商品削除用の DTO ファイルを作成（型定義）
2. 商品削除用のスキーマファイルを作成（Zod バリデーション）
3. 商品削除用のリポジトリファイルを作成（DB 操作）
4. 商品削除用のアクションファイルを作成（Server Action）
5. 商品削除確認ダイアログコンポーネントを作成（UI）
6. 商品削除ページファイルを作成（ルーティング）

**使う shadcn/ui コンポーネントと Tailwind クラスのヒント:**

- `Card`, `CardHeader`, `CardTitle`, `CardContent` = 削除確認のコンテナ
- `Button` = 削除・キャンセルボタン
- `space-y-6` = 要素間の余白
- `bg-destructive/10` = 警告背景色
- `text-destructive` = 警告文字色
- `max-w-2xl mx-auto` = 最大幅と中央配置
- `p-4 rounded-lg border` = パディング、角丸、ボーダー

**ダークテーマ最適化のスタイリングヒント:**

- 削除操作の危険性を`destructive`色で視覚的に表現
- 警告メッセージは薄い背景色で目立たせる
- 削除ボタンは`variant="destructive"`で危険性を強調

**DB 操作の手順:**

- `getProductById`: SELECT 文で商品データ取得
- `deleteProduct`: DELETE 文で商品削除
- `query raw`を使用して生 SQL を実行

## repeat_and_random_practice（Phase 3）

**同じ構文で別テーマ:**

- 投稿削除機能（Post 削除）
- ユーザー削除機能（User 削除）
- お問い合わせ削除機能（Contact 削除）

**毎回違うファイル名:**

- `PostDeleteDialog.tsx` → `PostRemoveDialog.tsx`
- `UserDeleteDialog.tsx` → `UserRemoveDialog.tsx`
- `ContactDeleteDialog.tsx` → `ContactRemoveDialog.tsx`

**テーマ差分は shadcn/ui テーマ変数と Tailwind のクラス変更で表現:**

- 投稿削除: `from-blue-500 to-blue-700`（青系グラデーション）
- ユーザー削除: `from-purple-500 to-purple-700`（紫系グラデーション）
- お問い合わせ削除: `from-orange-500 to-orange-700`（オレンジ系グラデーション）

**DB スキーマの拡張も含む:**

- 投稿削除: `posts`テーブル
- ユーザー削除: `users`テーブル
- お問い合わせ削除: `contacts`テーブル

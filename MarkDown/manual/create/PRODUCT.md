# Product T1 Create 実装手順

## 🎯 目的

Product 作成フォームの実装を通じて、Next.js App Router の Server Actions、Zod バリデーション、Prisma データベース操作、shadcn/ui コンポーネントの連携を学習します。

## 📁 ファイル構造

```
src/app/t1-create/product/
├── _schema/
│   └── product.ts          # バリデーションスキーマ
├── _dto/
│   └── product.ts          # データ転送オブジェクト
├── _repository/
│   └── productRepository.ts # データアクセス層
├── _action/
│   └── product.ts          # ビジネスロジック層
├── _presentational/
│   └── ProductForm.tsx     # プレゼンテーション層
└── page.tsx                # ページコンポーネント
```

## 🔄 データフローの全体像

```
1. ユーザーがフォームに入力
   ↓
2. フォーム送信（ProductForm.tsx）
   ↓
3. Server Action実行（_action/product.ts）
   ↓
4. バリデーション（_schema/product.ts）
   ↓
5. データベース保存（_repository/productRepository.ts）
   ↓
6. キャッシュ無効化（revalidateTag）
   ↓
7. リダイレクト（商品一覧ページへ）
```

## 📝 実装手順（15 分で完了）

### ステップ 1: バリデーションスキーマ作成（2 分）

**ファイル**: `_schema/product.ts`

**目的**: Product 作成時のデータ検証ルールを定義

**実装内容**:

```typescript
import { z } from "zod";
// ↑ Zodライブラリをインポート（型安全なバリデーション用）

// 新規作成用のスキーマ
export const createProductSchema = z.object({
	// ↑ z.object()でオブジェクトのスキーマを定義
	name: z
		.string() // 文字列型であることを指定
		.min(1, "商品名は必須です") // 最小1文字（空文字列を防ぐ）
		.max(100, "商品名は100文字以内で入力してください"), // 最大100文字制限
	category: z
		.string() // 文字列型であることを指定
		.min(1, "カテゴリは必須です") // 最小1文字（空文字列を防ぐ）
		.max(50, "カテゴリは50文字以内で入力してください"), // 最大50文字制限
	price: z
		.number() // 数値型であることを指定
		.positive("価格は正の数で入力してください"), // 正の数のみ許可（0や負数を防ぐ）
	stock: z
		.number() // 数値型であることを指定
		.int("在庫数は整数で入力してください") // 整数のみ許可（小数点を防ぐ）
		.min(0, "在庫数は0以上で入力してください"), // 0以上のみ許可（負数を防ぐ）
});

// 型推論用
export type CreateProductInput = z.infer<typeof createProductSchema>;
// ↑ z.inferでスキーマからTypeScriptの型を自動生成
// ↑ これにより、バリデーションルールと型定義が同期される
```

**この層の役割**: データの検証ルールを定義し、型安全性を保証する

### ステップ 2: DTO 型定義作成（2 分）

**ファイル**: `_dto/product.ts`

**目的**: Product データの型定義

**実装内容**:

```typescript
// 商品データの完全な型定義
export type Product = {
	// ↑ typeキーワードで型エイリアスを定義（interfaceではなくtypeを使用）
	id: number; // 商品ID（主キー）- データベースの自動採番
	name: string; // 商品名 - ユーザーが入力する文字列
	category: string; // カテゴリ - 'Electronics'|'Clothing'|'Books'のいずれか
	price: number; // 価格 - ユーザーが入力する数値
	stock: number; // 在庫数 - ユーザーが入力する整数
	createdAt: Date; // 作成日時 - データベースが自動設定するタイムスタンプ
};

// 一覧表示用の型定義（軽量化）
export type ProductListItem = Pick<Product, "id" | "name" | "price">;
// ↑ Pickユーティリティ型でProduct型から必要なフィールドのみを抽出
// ↑ 一覧表示ではカテゴリや在庫数は不要なので、パフォーマンス向上のため除外
```

**この層の役割**: データの構造を定義し、層間でのデータ受け渡しを型安全にする

### ステップ 3: リポジトリ関数作成（3 分）

**ファイル**: `_repository/productRepository.ts`

**目的**: データベースへの Product 作成処理

**実装内容**:

```typescript
import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（データベース接続用の共通ライブラリ）

import type { Product } from "../_dto/product";
// ↑ 型定義をインポート（型安全性のため、実行時には存在しない）

import type { CreateProductInput } from "../_schema/product";
// ↑ スキーマの型定義をインポート（バリデーション済みデータの型）

// 商品作成関数
export async function createProduct(data: CreateProductInput): Promise<Product> {
// ↑ async関数で非同期処理を宣言（データベース操作は非同期）
// ↑ 引数はCreateProductInput型（バリデーション済み）
// ↑ 戻り値はProduct型（作成された商品データ）

	const product = await prisma.$queryRaw<Product[]>`
// ↑ awaitで非同期処理の完了を待機
// ↑ prisma.$queryRawで生SQLクエリを実行（型安全性を保ちつつ柔軟性を確保）
// ↑ <Product[]>で戻り値の型を指定（配列として返される）

    INSERT INTO "products" (name, category, price, stock, created_at)
// ↑ INSERT文でproductsテーブルに新しいレコードを挿入
// ↑ カラム名を明示的に指定（SQLインジェクション対策）

    VALUES (${data.name}, ${data.category}, ${data.price}, ${data.stock}, NOW())
// ↑ VALUES句で挿入する値を指定
// ↑ ${}でパラメータ化クエリ（SQLインジェクション対策）
// ↑ NOW()で現在の日時を自動設定

    RETURNING id, name, category, price, stock, created_at as "createdAt"
// ↑ RETURNING句で挿入されたレコードを返す
// ↑ as "createdAt"でカラム名をキャメルケースに変換（JavaScriptの命名規則に合わせる）
  `;

	return product[0];
// ↑ 配列の最初の要素（作成された商品）を返す
// ↑ INSERT文は通常1件のレコードを作成するため、[0]でアクセス
}
```

**この層の役割**: データベースとの直接的なやり取りを担当し、SQL クエリを実行する

### ステップ 4: Server Action 作成（3 分）

**ファイル**: `_action/product.ts`

**目的**: フォーム送信時のビジネスロジック

**実装内容**:

```typescript
"use server";
// ↑ Server Actionのディレクティブ（サーバーサイドで実行されることを明示）

import { revalidateTag } from "next/cache";
// ↑ Next.jsのキャッシュ無効化関数（データ更新後にキャッシュをクリア）

import { redirect } from "next/navigation";
// ↑ Next.jsのリダイレクト関数（ページ遷移を制御）

import {
	createProductSchema,
	type CreateProductInput,
} from "../_schema/product";
// ↑ バリデーションスキーマと型定義をインポート

import { createProduct } from "../_repository/productRepository";
// ↑ データアクセス層の関数をインポート

// アクションの結果型
export type ActionResult = {
	// ↑ Server Actionの戻り値の型定義（エラーハンドリング用）
	success: boolean; // 成功/失敗のフラグ
	error?: string; // エラーメッセージ（オプショナル）
	fieldErrors?: Record<string, string[]>; // フィールド別エラー（オプショナル）
};

// 商品作成アクション
export async function createProductAction(formData: FormData) {
	// ↑ Server Actionの関数（フォーム送信時に呼び出される）
	// ↑ FormData型の引数（HTMLフォームから送信されたデータ）

	// フォームデータをオブジェクトに変換
	const rawData = {
		// ↑ フォームデータをJavaScriptオブジェクトに変換
		name: formData.get("name") as string,
		// ↑ formData.get()でフォームフィールドの値を取得
		// ↑ as stringで型アサーション（FormDataはstring | File | nullを返すため）
		category: formData.get("category") as string,
		// ↑ カテゴリフィールドの値を取得
		price: parseFloat(formData.get("price") as string),
		// ↑ 価格フィールドの値を取得し、parseFloat()で数値に変換
		stock: parseInt(formData.get("stock") as string),
		// ↑ 在庫数フィールドの値を取得し、parseInt()で整数に変換
	};

	// バリデーション実行
	const validatedData = createProductSchema.parse(rawData);
	// ↑ Zodスキーマでバリデーションを実行
	// ↑ parse()は成功時はデータを返し、失敗時は例外を投げる

	// データベースに保存
	await createProduct(validatedData);
	// ↑ バリデーション済みデータをデータベースに保存
	// ↑ awaitで非同期処理の完了を待機

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");
	// ↑ "products"タグのキャッシュを無効化
	// ↑ これにより、商品一覧ページが最新データで再生成される

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
	// ↑ 商品一覧ページにリダイレクト
	// ↑ ユーザーに作成完了を視覚的に示す
}
```

**この層の役割**: ビジネスロジックを実行し、データの流れを制御する

### ステップ 5: フォームコンポーネント作成（4 分）

**ファイル**: `_presentational/ProductForm.tsx`

**目的**: Product 作成フォームの UI

**実装内容**:

```typescript
"use client";
// ↑ クライアントコンポーネントのディレクティブ（ブラウザで実行される）

import { Button } from "@/components/ui/button";
// ↑ shadcn/uiのボタンコンポーネント（統一されたデザインシステム）

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのカードコンポーネント（コンテンツを囲む枠組み）

import { Input } from "@/components/ui/input";
// ↑ shadcn/uiの入力フィールドコンポーネント

import { Label } from "@/components/ui/label";
// ↑ shadcn/uiのラベルコンポーネント（フォームフィールドの説明）

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
// ↑ shadcn/uiのセレクトコンポーネント（ドロップダウン選択用）

import { createProductAction } from "../_action/product";
// ↑ Server Actionをインポート（フォーム送信時に実行される）

export function ProductForm() {
	// ↑ フォームコンポーネントの関数（React関数コンポーネント）

	return (
		// ↑ JSXを返す（HTMLライクな構文でUIを記述）
		<Card className="max-w-2xl mx-auto">
			// ↑ Cardコンポーネントでフォーム全体を囲む // ↑
			max-w-2xlで最大幅を制限（読みやすさのため） // ↑
			mx-autoで中央寄せ（左右のマージンを自動調整）
			<CardHeader>
				// ↑ カードのヘッダー部分（タイトル表示用）
				<CardTitle className="text-2xl font-bold">
					// ↑ カードのタイトル（見出し） // ↑ text-2xlでフォントサイズを指定 //
					↑ font-boldでフォントウェイトを太字に 🛍️ 新しい商品を作成 // ↑
					タイトルテキスト（絵文字で視覚的に分かりやすく）
				</CardTitle>
			</CardHeader>
			<CardContent>
				// ↑ カードのコンテンツ部分（フォーム本体）
				<form action={createProductAction} className="space-y-6">
					// ↑ HTMLのform要素（フォーム送信の基盤） // ↑ action属性にServer
					Actionを指定（送信時に実行される） // ↑
					space-y-6で子要素間に縦の余白を設定
					{/* 商品名入力 */}
					<div className="space-y-2">
						// ↑ フォームフィールドを囲むdiv（レイアウト用） // ↑
						space-y-2で子要素間に縦の余白を設定
						<Label htmlFor="name">商品名 *</Label>
						// ↑ ラベル要素（フィールドの説明） // ↑
						htmlFor属性でinput要素と関連付け（アクセシビリティ向上） // ↑
						*マークで必須項目であることを示す
						<Input
							// ↑ 入力フィールドコンポーネント
							id="name"
							// ↑ 要素のID（LabelのhtmlForと対応）
							name="name"
							// ↑ フォーム送信時のフィールド名（Server Actionで取得する際のキー）
							placeholder="商品名を入力してください"
							// ↑ プレースホルダーテキスト（入力例の提示）
							required
							// ↑ 必須項目の指定（HTML5のバリデーション）
						/>
					</div>
					{/* カテゴリ選択 */}
					<div className="space-y-2">
						// ↑ カテゴリ選択フィールドを囲むdiv
						<Label htmlFor="category">カテゴリ *</Label>
						// ↑ カテゴリフィールドのラベル
						<Select name="category" required>
							// ↑ セレクトコンポーネント（ドロップダウン選択） // ↑
							name属性でフォーム送信時のフィールド名を指定 // ↑
							required属性で必須項目を指定
							<SelectTrigger>
								// ↑ セレクトのトリガー部分（クリック可能な領域）
								<SelectValue placeholder="カテゴリを選択してください" />
								// ↑ セレクトの値表示部分（プレースホルダー付き）
							</SelectTrigger>
							<SelectContent>
								// ↑ セレクトのドロップダウン内容
								<SelectItem value="Electronics">Electronics</SelectItem>
								// ↑ 選択肢（電子機器系カテゴリ）
								<SelectItem value="Clothing">Clothing</SelectItem>
								// ↑ 選択肢（衣類系カテゴリ）
								<SelectItem value="Books">Books</SelectItem>
								// ↑ 選択肢（書籍系カテゴリ）
							</SelectContent>
						</Select>
					</div>
					{/* 価格入力 */}
					<div className="space-y-2">
						// ↑ 価格入力フィールドを囲むdiv
						<Label htmlFor="price">価格 *</Label>
						// ↑ 価格フィールドのラベル
						<Input
							// ↑ 数値入力フィールド
							id="price"
							// ↑ 要素のID
							name="price"
							// ↑ フォーム送信時のフィールド名
							type="number"
							// ↑ 入力タイプを数値に指定（ブラウザの数値入力UIを有効化）
							step="0.01"
							// ↑ 小数点以下2桁まで入力可能
							placeholder="0.00"
							// ↑ プレースホルダー（入力例の提示）
							required
							// ↑ 必須項目の指定
						/>
					</div>
					{/* 在庫数入力 */}
					<div className="space-y-2">
						// ↑ 在庫数入力フィールドを囲むdiv
						<Label htmlFor="stock">在庫数 *</Label>
						// ↑ 在庫数フィールドのラベル
						<Input
							// ↑ 数値入力フィールド
							id="stock"
							// ↑ 要素のID
							name="stock"
							// ↑ フォーム送信時のフィールド名
							type="number"
							// ↑ 入力タイプを数値に指定（ブラウザの数値入力UIを有効化）
							min="0"
							// ↑ 最小値を0に設定（負数を防ぐ）
							placeholder="0"
							// ↑ プレースホルダー（入力例の提示）
							required
							// ↑ 必須項目の指定
						/>
					</div>
					{/* 送信ボタン */}
					<div className="flex gap-4">
						// ↑ ボタン群を囲むdiv（横並びレイアウト） // ↑ flexで横並び配置 //
						↑ gap-4でボタン間に余白を設定
						<Button type="submit" className="flex-1">
							// ↑ 送信ボタン（メインアクション） // ↑
							type="submit"でフォーム送信を実行 // ↑
							flex-1で利用可能な幅を最大限使用 商品を作成 // ↑ ボタンのテキスト
						</Button>
						<Button type="button" variant="outline" asChild>
							// ↑ キャンセルボタン（セカンダリアクション） // ↑
							type="button"でフォーム送信を防ぐ // ↑
							variant="outline"でアウトラインスタイルを適用 // ↑
							asChildで子要素をボタンとして扱う
							<a href="/t2-read-list/products">キャンセル</a>
							// ↑ リンク要素（一覧ページへの遷移）
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
```

**この層の役割**: ユーザーインターフェースを構築し、ユーザーの操作を受け付ける

### ステップ 6: ページコンポーネント作成（1 分）

**ファイル**: `page.tsx`

**目的**: Product 作成ページのレイアウト

**実装内容**:

```typescript
import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング用）

import { ProductForm } from "./_presentational/ProductForm";
// ↑ フォームコンポーネントをインポート

export default function T1CreateProductPage() {
	// ↑ ページコンポーネントの関数（デフォルトエクスポート）
	// ↑ 関数名はページの役割を表す

	return (
		// ↑ JSXを返す（ページの構造を定義）
		<div className="min-h-screen bg-background">
			// ↑ ページ全体を囲むdiv（最小高さを画面全体に設定） // ↑
			min-h-screenで最小高さを画面の高さに設定 // ↑
			bg-backgroundで背景色を設定（shadcn/uiのテーマ変数）
			<div className="container mx-auto px-4 py-8">
				// ↑ コンテンツを囲むdiv（レスポンシブレイアウト） // ↑
				containerで最大幅を制限 // ↑ mx-autoで中央寄せ // ↑
				px-4で左右のパディングを設定 // ↑ py-8で上下のパディングを設定
				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					// ↑ ヘッダー部分を囲むdiv（大きな下マージンと中央寄せ） // ↑
					mb-12で下マージンを設定 // ↑ text-centerでテキストを中央寄せ
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						// ↑ メインタイトル（h1要素） // ↑ text-4xlで大きなフォントサイズ //
						↑ font-boldで太字 // ↑ mb-4で下マージン // ↑
						bg-gradient-to-rでグラデーション背景（左から右へ） // ↑ from-primary
						to-primary/70でプライマリカラーから70%透明度のプライマリカラーへ //
						↑ bg-clip-textで背景をテキストにクリップ // ↑
						text-transparentでテキストを透明にしてグラデーションを表示 🛍️ T1.
						Create（新規作成） // ↑
						タイトルテキスト（絵文字で視覚的に分かりやすく）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						// ↑ 説明文（p要素） // ↑
						text-muted-foregroundで控えめな色（shadcn/uiのテーマ変数） // ↑
						text-lgで大きなフォントサイズ // ↑ max-w-2xlで最大幅を制限 // ↑
						mx-autoで中央寄せ // ↑ leading-relaxedで行間を広く設定
						新しい商品を作成しましょう // ↑ メインの説明文
						<br />
						// ↑ 改行
						<span className="text-sm text-muted-foreground/80">
							// ↑ 補足説明（span要素） // ↑ text-smで小さなフォントサイズ // ↑
							text-muted-foreground/80で80%透明度の控えめな色
							フォームに記入して商品を作成できます // ↑ 補足説明のテキスト
						</span>
					</p>
				</div>
				{/* 戻るボタン */}
				<div className="mb-6">
					// ↑ 戻るボタンを囲むdiv（下マージン付き）
					<Link
						// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）
						href="/t2-read-list/products"
						// ↑ 遷移先のURL（商品一覧ページ）
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
						// ↑ スタイリングクラス
						// ↑ inline-flexでインラインフレックスレイアウト
						// ↑ items-centerで子要素を垂直中央寄せ
						// ↑ text-smで小さなフォントサイズ
						// ↑ text-muted-foregroundで控えめな色
						// ↑ hover:text-primaryでホバー時にプライマリカラーに変更
						// ↑ transition-colorsで色の変化にアニメーション
					>
						← 商品リストに戻る // ↑ リンクテキスト（左矢印で戻ることを示す）
					</Link>
				</div>
				{/* フォーム */}
				<ProductForm />
				// ↑ フォームコンポーネントを配置
			</div>
		</div>
	);
}
```

**この層の役割**: ページ全体のレイアウトを定義し、ユーザーエクスペリエンスを提供する

## 🎨 shadcn/ui + Tailwind CSS の活用

- **Card**: コンテンツを囲む枠組み（統一されたデザイン）
- **Button**: アクションボタン（プライマリ・セカンダリの区別）
- **Input**: 入力フィールド（一貫したスタイリング）
- **Select**: ドロップダウン選択（アクセシビリティ対応）
- **Label**: フォームラベル（適切な関連付け）

## 🗄️ データベース操作の特徴

- **テーブル**: `products`
- **カラム**: `name`, `category`, `price`, `stock`, `created_at`
- **クエリ**: `INSERT INTO "products" ... RETURNING ...`
- **$queryRaw**: 生 SQL クエリで柔軟性とパフォーマンスを確保
- **パラメータ化クエリ**: SQL インジェクション対策
- **型安全性**: TypeScript の型定義で実行時エラーを防止

## 🚀 Next.js App Router の特徴

- **Server Actions**: サーバーサイドでのフォーム処理
- **Server Components**: サーバーサイドでのレンダリング
- **revalidateTag**: キャッシュの効率的な管理
- **redirect**: ページ遷移の制御

## ✅ 完成後の動作

1. フォームに入力（商品名、カテゴリ、価格、在庫数）
2. 送信ボタンクリック
3. バリデーション実行（Zod スキーマ）
4. データベースに保存（Prisma + SQL）
5. キャッシュ無効化（revalidateTag）
6. 商品一覧ページにリダイレクト

この実装により、Post と同様の構造で Product の T1 Create を実現し、モダンな Web アプリケーションの基本的な CRUD 操作（Create）を、型安全性、パフォーマンス、ユーザビリティを考慮して実装できます！

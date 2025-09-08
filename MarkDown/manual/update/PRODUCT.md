# Product 更新機能の作成手順解説

## 🎯 概要

Product テーブルの商品情報を更新する機能を作成します。既存の Post 更新機能と同じ構成で、ドメイン駆動設計のアーキテクチャに従って実装します。

**なぜこの機能が必要なのか？**

- 商品情報は時間とともに変更される（価格変動、在庫数の変化、商品名の修正など）
- 管理者が商品情報を簡単に更新できる UI が必要
- データの整合性を保ちながら、安全に更新処理を行う必要がある

## 📁 ファイル構成

```
practice/src/app/t4-update/product/
├── _dto/
│   └── product.ts                    # 型定義
├── _schema/
│   └── product.ts                    # バリデーション
├── _repository/
│   └── productRepository.ts          # DB操作
├── _action/
│   └── product.ts                    # Server Action
├── _presentational/
│   └── ProductUpdateForm.tsx         # UI コンポーネント
└── [id]/
    └── page.tsx                      # ページコンポーネント
```

## 🔧 実装手順

### 1. DTO（Data Transfer Object）の作成

**ファイル**: `_dto/product.ts`

```typescript
export type Product = {
	id: number; // 商品ID（主キー）
	name: string; // 商品名
	category: string; // カテゴリ
	price: number; // 価格
	stock: number; // 在庫数
	createdAt: Date; // 作成日時
};

export type ProductListItem = Pick<Product, "id" | "name" | "createdAt">;
```

**一行ずつの詳細解説**:

```typescript
export type Product = {
```

- `export`: 他のファイルからこの型をインポートできるようにする
- `type`: TypeScript の型エイリアスを定義（interface ではなく type を使用）
- `Product`: 商品を表す型の名前（PascalCase で命名）

```typescript
id: number; // 商品ID（主キー）
```

- `id`: 商品を一意に識別するための ID
- `number`: TypeScript の数値型（整数・小数両方対応）
- なぜ必要？: データベースの主キーとして機能し、商品を特定するために必須

```typescript
name: string; // 商品名
```

- `name`: 商品の名前を表すプロパティ
- `string`: TypeScript の文字列型
- なぜ必要？: ユーザーが商品を識別するための最も重要な情報

```typescript
category: string; // カテゴリ
```

- `category`: 商品の分類を表すプロパティ
- なぜ必要？: 商品を分類することで、検索やフィルタリングが可能になる

```typescript
price: number; // 価格
```

- `price`: 商品の価格を表すプロパティ
- `number`: 価格は数値で管理（整数・小数両方対応）
- なぜ必要？: 商品の価格情報は販売に必須

```typescript
stock: number; // 在庫数
```

- `stock`: 商品の在庫数を表すプロパティ
- なぜ必要？: 在庫管理により、売り切れ商品の表示や発注判断が可能

```typescript
createdAt: Date; // 作成日時
```

- `createdAt`: 商品が作成された日時
- `Date`: TypeScript の日付型
- なぜ必要？: 商品の履歴管理や時系列での表示に使用

```typescript
};
```

- 型定義の終了を示す

```typescript
export type ProductListItem = Pick<Product, "id" | "name" | "createdAt">;
```

- `Pick`: TypeScript のユーティリティ型（既存の型から特定のプロパティのみを抽出）
- `Product`: 元となる型
- `"id" | "name" | "createdAt"`: 抽出したいプロパティ名を文字列リテラル型で指定
- なぜ必要？: 一覧表示では全情報は不要で、パフォーマンス向上のため軽量化

### 2. スキーマ（バリデーション）の作成

**ファイル**: `_schema/product.ts`

```typescript
import { z } from "zod";

export const updateProductSchema = z.object({
	id: z
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
	name: z
		.string()
		.min(1, "名前は必須です")
		.max(100, "名前は100文字以内で入力してください"),
	category: z
		.string()
		.min(1, "カテゴリは必須です")
		.max(50, "カテゴリは50文字以内で入力してください"),
	price: z.number().min(0, "価格は0以上で入力してください"),
	stock: z
		.int("在庫数は整数で入力してください")
		.min(0, "在庫数は0以上で入力してください"),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
```

**一行ずつの詳細解説**:

```typescript
import { z } from "zod";
```

- `import`: 外部ライブラリをインポート
- `{ z }`: zod ライブラリのデフォルトエクスポートを z という名前でインポート
- なぜ必要？: ランタイムバリデーションと TypeScript 型推論を同時に提供するライブラリ

```typescript
export const updateProductSchema = z.object({
```

- `export`: 他のファイルからこのスキーマをインポートできるようにする
- `const`: 定数として定義（変更不可）
- `updateProductSchema`: スキーマの名前（商品更新用）
- `z.object`: zod のオブジェクト型バリデーション
- なぜ必要？: フォームデータの構造と型を定義し、バリデーションルールを設定

```typescript
	id: z
		.int("IDは整数で入力してください")
		.positive("IDは正の数で入力してください"),
```

- `id`: 商品 ID のバリデーションルール
- `z.int`: 整数であることを検証
- `"IDは整数で入力してください"`: バリデーション失敗時のエラーメッセージ
- `.positive`: 正の数（0 より大きい）であることを検証
- なぜ必要？: 無効な ID でデータベースを更新しようとするのを防ぐ

```typescript
	name: z
		.string()
		.min(1, "名前は必須です")
		.max(100, "名前は100文字以内で入力してください"),
```

- `name`: 商品名のバリデーションルール
- `z.string`: 文字列型であることを検証
- `.min(1)`: 最低 1 文字以上であることを検証
- `"名前は必須です"`: 空文字列の場合のエラーメッセージ
- `.max(100)`: 最大 100 文字以下であることを検証
- なぜ必要？: 空の商品名や長すぎる商品名を防ぎ、データベースの制約に合わせる

```typescript
	category: z
		.string()
		.min(1, "カテゴリは必須です")
		.max(50, "カテゴリは50文字以内で入力してください"),
```

- `category`: カテゴリのバリデーションルール
- なぜ必要？: カテゴリは商品分類に重要で、空や長すぎる値を防ぐ

```typescript
	price: z.number().min(0, "価格は0以上で入力してください"),
```

- `price`: 価格のバリデーションルール
- `z.number`: 数値型であることを検証
- `.min(0)`: 0 以上であることを検証（負の価格を防ぐ）
- なぜ必要？: 価格は負の値であってはならず、数値でなければならない

```typescript
	stock: z
		.int("在庫数は整数で入力してください")
		.min(0, "在庫数は0以上で入力してください"),
```

- `stock`: 在庫数のバリデーションルール
- `z.int`: 整数であることを検証（小数の在庫数は存在しない）
- `.min(0)`: 0 以上であることを検証（負の在庫数を防ぐ）
- なぜ必要？: 在庫数は整数で、負の値は意味がない

```typescript
});
```

- オブジェクトのバリデーションルール定義の終了

```typescript
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
```

- `export type`: 型定義をエクスポート
- `UpdateProductInput`: 型の名前（商品更新入力用）
- `z.infer`: zod スキーマから TypeScript 型を自動推論
- `typeof updateProductSchema`: updateProductSchema の型を取得
- なぜ必要？: バリデーションルールと型定義を同期させ、型安全性を保証

### 3. リポジトリ（DB 操作）の作成

**ファイル**: `_repository/productRepository.ts`

```typescript
import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { UpdateProductInput } from "../_schema/product";

export async function getProductById(id: number) {
	const product = await prisma.$queryRaw<Product[]>`
  SELECT
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  FROM
    "products"
  WHERE
    id = ${id}
  `;

	return product[0] || null;
}

export async function updateProduct(data: UpdateProductInput) {
	const product = await prisma.$queryRaw<Product[]>`
  UPDATE "products"
  SET
    name = ${data.name},
    category = ${data.category},
    price = ${data.price},
    stock = ${data.stock}
  WHERE id = ${data.id}
  RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  `;

	return product[0];
}
```

**一行ずつの詳細解説**:

```typescript
import { prisma } from "@/lib/prisma";
```

- `import`: 外部モジュールをインポート
- `{ prisma }`: Prisma クライアントを prisma という名前でインポート
- `@/lib/prisma`: プロジェクトルートからの相対パス（@は tsconfig.json で設定）
- なぜ必要？: データベースにアクセスするためのクライアント

```typescript
import type { Product } from "../_dto/product";
```

- `import type`: 型定義のみをインポート（実行時には存在しない）
- `{ Product }`: Product 型をインポート
- `../_dto/product`: 相対パスで DTO ファイルを指定
- なぜ必要？: 型安全性を保つため、データベースから取得するデータの型を定義

```typescript
import type { UpdateProductInput } from "../_schema/product";
```

- `UpdateProductInput`: 商品更新用の入力型をインポート
- なぜ必要？: 更新関数の引数の型を定義し、型安全性を保証

```typescript
export async function getProductById(id: number) {
```

- `export`: 他のファイルからこの関数をインポートできるようにする
- `async`: 非同期関数であることを示す
- `function`: 関数を定義
- `getProductById`: 関数名（ID で商品を取得する）
- `(id: number)`: 引数（数値型の ID）
- なぜ必要？: 指定された ID の商品データを取得する機能

```typescript
	const product = await prisma.$queryRaw<Product[]>`
```

- `const`: 定数として定義
- `product`: 変数名（取得した商品データを格納）
- `await`: 非同期処理の完了を待つ
- `prisma.$queryRaw`: Prisma の生 SQL クエリ実行メソッド
- `<Product[]>`: 戻り値の型を指定（Product 型の配列）
- なぜ必要？: 型安全性を保ちながら、柔軟な SQL クエリを実行

```typescript
  SELECT
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  FROM
    "products"
  WHERE
    id = ${id}
  `;
```

- `SELECT`: データを取得する SQL 文
- `id, name, category, price, stock`: 取得するカラム名
- `created_at as "createdAt"`: カラム名をキャメルケースに変換
- `FROM "products"`: products テーブルから取得
- `WHERE id = ${id}`: 指定された ID のレコードのみ取得
- `${id}`: パラメータ化クエリ（SQL インジェクション対策）
- なぜ必要？: 特定の商品データのみを安全に取得

```typescript
return product[0] || null;
```

- `return`: 関数の戻り値を返す
- `product[0]`: 配列の最初の要素（商品データ）
- `|| null`: 配列が空の場合は null を返す
- なぜ必要？: 商品が見つからない場合の処理と、型安全性の確保

```typescript
export async function updateProduct(data: UpdateProductInput) {
```

- `updateProduct`: 商品を更新する関数
- `(data: UpdateProductInput)`: 更新データを引数として受け取る
- なぜ必要？: 商品情報をデータベースで更新する機能

```typescript
const product = await prisma.$queryRaw<Product[]>`
  UPDATE "products"
  SET
    name = ${data.name},
    category = ${data.category},
    price = ${data.price},
    stock = ${data.stock}
  WHERE id = ${data.id}
  RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at as "createdAt"
  `;
```

- `UPDATE "products"`: products テーブルを更新
- `SET`: 更新するカラムと値を指定
- `name = ${data.name}`: 商品名を更新（パラメータ化クエリ）
- `WHERE id = ${data.id}`: 指定された ID のレコードのみ更新
- `RETURNING`: 更新後のデータを取得（PostgreSQL の機能）
- なぜ必要？: 更新処理の確認と、更新後のデータを返すため

```typescript
return product[0];
```

- 更新された商品データの最初の要素を返す
- なぜ必要？: 更新処理が成功したことを確認し、更新後のデータを利用可能にする

### 4. Server Action の作成

**ファイル**: `_action/product.ts`

```typescript
"use server";
import { updateProductSchema } from "../_schema/product";
import { updateProduct } from "../_repository/productRepository";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProductAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
		name: formData.get("name") as string,
		category: formData.get("category") as string,
		price: parseFloat(formData.get("price") as string),
		stock: parseInt(formData.get("stock") as string),
	};

	// バリデーション実行
	const validatedData = updateProductSchema.parse(rawData);

	// データベースを更新
	await updateProduct(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
}
```

**一行ずつの詳細解説**:

```typescript
"use server";
```

- Next.js のディレクティブ（指示）
- このファイル内の関数が Server Action であることを明示
- なぜ必要？: サーバーサイドで実行されることを Next.js に伝える

```typescript
import { updateProductSchema } from "../_schema/product";
```

- バリデーションスキーマをインポート
- なぜ必要？: フォームデータの検証に使用

```typescript
import { updateProduct } from "../_repository/productRepository";
```

- データベース更新関数をインポート
- なぜ必要？: 実際のデータベース更新処理を実行

```typescript
import { revalidateTag } from "next/cache";
```

- Next.js のキャッシュ無効化関数をインポート
- なぜ必要？: データ更新後にキャッシュをクリアして最新データを表示

```typescript
import { redirect } from "next/navigation";
```

- Next.js のリダイレクト関数をインポート
- なぜ必要？: 処理完了後に別のページに遷移

```typescript
export async function updateProductAction(formData: FormData) {
```

- `export`: 他のファイルからこの関数をインポートできるようにする
- `async`: 非同期関数（データベース操作は非同期）
- `updateProductAction`: Server Action の関数名
- `(formData: FormData)`: HTML フォームから送信されたデータを受け取る
- なぜ必要？: フォーム送信時の処理を定義

```typescript
	// フォームデータをオブジェクトに変換
	const rawData = {
```

- コメント: 処理の説明
- `const rawData`: 変換前の生データを格納する変数
- なぜ必要？: FormData は使いにくいので、オブジェクトに変換

```typescript
		id: parseInt(formData.get("id") as string),
```

- `formData.get("id")`: フォームの"id"フィールドの値を取得
- `as string`: TypeScript の型アサーション（文字列として扱う）
- `parseInt()`: 文字列を整数に変換
- なぜ必要？: フォームデータは文字列なので、数値に変換が必要

```typescript
		name: formData.get("name") as string,
```

- 商品名を文字列として取得
- なぜ必要？: 商品名の更新データを取得

```typescript
		category: formData.get("category") as string,
```

- カテゴリを文字列として取得
- なぜ必要？: カテゴリの更新データを取得

```typescript
		price: parseFloat(formData.get("price") as string),
```

- `parseFloat()`: 文字列を小数点数に変換
- なぜ必要？: 価格は小数点数なので、適切な型に変換

```typescript
		stock: parseInt(formData.get("stock") as string),
```

- 在庫数を整数に変換
- なぜ必要？: 在庫数は整数なので、適切な型に変換

```typescript
	};
```

- オブジェクト定義の終了

```typescript
// バリデーション実行
const validatedData = updateProductSchema.parse(rawData);
```

- コメント: 処理の説明
- `updateProductSchema.parse()`: Zod スキーマでデータを検証
- エラー時は例外を投げて処理を中断
- なぜ必要？: 不正なデータでデータベースを更新するのを防ぐ

```typescript
// データベースを更新
await updateProduct(validatedData);
```

- コメント: 処理の説明
- `await`: 非同期処理の完了を待つ
- `updateProduct()`: リポジトリ層の更新関数を呼び出し
- なぜ必要？: 実際のデータベース更新を実行

```typescript
// キャッシュを無効化（一覧を更新）
revalidateTag("products");
```

- コメント: 処理の説明
- `revalidateTag("products")`: "products"タグのキャッシュを無効化
- なぜ必要？: 更新されたデータが一覧ページに反映されるようにする

```typescript
// 一覧ページにリダイレクト
redirect("/t2-read-list/products");
```

- コメント: 処理の説明
- `redirect()`: 指定された URL にリダイレクト
- なぜ必要？: 処理完了後にユーザーを適切なページに遷移させる

### 5. UI コンポーネントの作成

**ファイル**: `_presentational/ProductUpdateForm.tsx`

```typescript
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateProductAction } from "../_action/product";
import type { Product } from "../_dto/product";

type ProductUpdateFormProps = {
	product: Product;
};

export default function ProductUpdateForm({ product }: ProductUpdateFormProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">✏️ 商品を更新</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={updateProductAction} className="space-y-6">
					{/* ID（隠しフィールド） */}
					<input type="hidden" name="id" value={product.id} />

					{/* 商品名入力 */}
					<div className="space-y-2">
						<Label htmlFor="name">商品名 *</Label>
						<Input
							id="name"
							name="name"
							placeholder="商品名を入力してください"
							defaultValue={product.name}
							required
						/>
					</div>

					{/* カテゴリ選択 */}
					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ *</Label>
						<Select name="category" required defaultValue={product.category}>
							<SelectTrigger>
								<SelectValue placeholder="カテゴリを選択してください" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Accessories">Accessories</SelectItem>
								<SelectItem value="Peripherals">Peripherals</SelectItem>
								<SelectItem value="Display">Display</SelectItem>
								<SelectItem value="Storage">Storage</SelectItem>
								<SelectItem value="Audio">Audio</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* 価格入力 */}
					<div className="space-y-2">
						<Label htmlFor="price">価格 *</Label>
						<Input
							id="price"
							name="price"
							type="number"
							defaultValue={product.price}
							required
						/>
					</div>

					{/* 在庫数入力 */}
					<div className="space-y-2">
						<Label htmlFor="stock">在庫数 *</Label>
						<Input
							id="stock"
							name="stock"
							type="number"
							placeholder="在庫数を入力"
							defaultValue={product.stock}
							required
						/>
					</div>

					{/* 送信ボタン */}
					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							商品を更新
						</Button>
						<Button type="button" variant="outline" asChild>
							<a href="/t2-read-list/products">キャンセル</a>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
```

**一行ずつの詳細解説**:

```typescript
"use client";
```

- Next.js のディレクティブ
- このコンポーネントがクライアントサイドで実行されることを明示
- なぜ必要？: インタラクティブな要素（フォーム、ボタン）を使用するため

```typescript
import React from "react";
```

- React ライブラリをインポート
- なぜ必要？: JSX を使用するために必要

```typescript
import { Button } from "@/components/ui/button";
```

- shadcn/ui の Button コンポーネントをインポート
- なぜ必要？: 統一されたデザインのボタンを使用

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

- shadcn/ui の Card コンポーネント群をインポート
- なぜ必要？: フォームをカード形式で表示し、視覚的に整理

```typescript
import { Input } from "@/components/ui/input";
```

- shadcn/ui の Input コンポーネントをインポート
- なぜ必要？: 統一されたデザインの入力フィールドを使用

```typescript
import { Label } from "@/components/ui/label";
```

- shadcn/ui の Label コンポーネントをインポート
- なぜ必要？: フォームのアクセシビリティ向上（ラベルと入力の関連付け）

```typescript
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
```

- shadcn/ui の Select コンポーネント群をインポート
- なぜ必要？: カテゴリ選択用のドロップダウンメニュー

```typescript
import { updateProductAction } from "../_action/product";
```

- Server Action をインポート
- なぜ必要？: フォーム送信時に実行する処理

```typescript
import type { Product } from "../_dto/product";
```

- Product 型をインポート
- なぜ必要？: コンポーネントの props の型定義に使用

```typescript
type ProductUpdateFormProps = {
	product: Product;
};
```

- コンポーネントの props の型定義
- なぜ必要？: TypeScript の型安全性を保証

```typescript
export default function ProductUpdateForm({ product }: ProductUpdateFormProps) {
```

- デフォルトエクスポートの関数コンポーネント
- `{ product }`: props から product を分割代入で取得
- なぜ必要？: 商品データを受け取ってフォームを表示

```typescript
	return (
		<Card className="max-w-2xl mx-auto">
```

- Card コンポーネントでフォームを囲む
- `max-w-2xl`: 最大幅を 2xl に制限
- `mx-auto`: 左右のマージンを自動（中央揃え）
- なぜ必要？: フォームの幅を制限し、中央に配置

```typescript
<CardHeader>
	<CardTitle className="text-2xl font-bold">✏️ 商品を更新</CardTitle>
</CardHeader>
```

- カードのヘッダー部分
- `text-2xl font-bold`: 大きな太字のタイトル
- なぜ必要？: フォームの目的を明確に表示

```typescript
			<CardContent>
				<form action={updateProductAction} className="space-y-6">
```

- カードのコンテンツ部分
- `action={updateProductAction}`: フォーム送信時に Server Action を実行
- `space-y-6`: 子要素間に縦方向のスペースを追加
- なぜ必要？: フォームの送信処理とレイアウトの設定

```typescript
{
	/* ID（隠しフィールド） */
}
<input type="hidden" name="id" value={product.id} />;
```

- 隠しフィールドで商品 ID を送信
- `type="hidden"`: ユーザーには見えないフィールド
- `name="id"`: フォームデータのキー名
- `value={product.id}`: 商品の ID を値として設定
- なぜ必要？: どの商品を更新するかを識別するため

```typescript
{
	/* 商品名入力 */
}
<div className="space-y-2">
	<Label htmlFor="name">商品名 *</Label>
	<Input
		id="name"
		name="name"
		placeholder="商品名を入力してください"
		defaultValue={product.name}
		required
	/>
</div>;
```

- 商品名入力フィールド
- `htmlFor="name"`: ラベルと入力フィールドを関連付け
- `id="name"`: 入力フィールドの ID
- `name="name"`: フォームデータのキー名
- `defaultValue={product.name}`: 既存の商品名で初期化
- `required`: 必須フィールドとして設定
- なぜ必要？: 商品名の更新入力とアクセシビリティの確保

```typescript
{
	/* カテゴリ選択 */
}
<div className="space-y-2">
	<Label htmlFor="category">カテゴリ *</Label>
	<Select name="category" required defaultValue={product.category}>
		<SelectTrigger>
			<SelectValue placeholder="カテゴリを選択してください" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="Accessories">Accessories</SelectItem>
			<SelectItem value="Peripherals">Peripherals</SelectItem>
			<SelectItem value="Display">Display</SelectItem>
			<SelectItem value="Storage">Storage</SelectItem>
			<SelectItem value="Audio">Audio</SelectItem>
		</SelectContent>
	</Select>
</div>;
```

- カテゴリ選択ドロップダウン
- `defaultValue={product.category}`: 既存のカテゴリで初期化
- `SelectItem`: 各選択肢を定義
- なぜ必要？: カテゴリの選択と、既存値の表示

```typescript
{
	/* 価格入力 */
}
<div className="space-y-2">
	<Label htmlFor="price">価格 *</Label>
	<Input
		id="price"
		name="price"
		type="number"
		defaultValue={product.price}
		required
	/>
</div>;
```

- 価格入力フィールド
- `type="number"`: 数値入力専用のフィールド
- なぜ必要？: 価格の数値入力と、ブラウザの数値入力支援

```typescript
{
	/* 在庫数入力 */
}
<div className="space-y-2">
	<Label htmlFor="stock">在庫数 *</Label>
	<Input
		id="stock"
		name="stock"
		type="number"
		placeholder="在庫数を入力"
		defaultValue={product.stock}
		required
	/>
</div>;
```

- 在庫数入力フィールド
- `placeholder`: 入力例を表示
- なぜ必要？: 在庫数の数値入力と、ユーザーガイダンス

```typescript
{
	/* 送信ボタン */
}
<div className="flex gap-4">
	<Button type="submit" className="flex-1">
		商品を更新
	</Button>
	<Button type="button" variant="outline" asChild>
		<a href="/t2-read-list/products">キャンセル</a>
	</Button>
</div>;
```

- 送信・キャンセルボタン
- `type="submit"`: フォーム送信ボタン
- `flex-1`: 送信ボタンを幅いっぱいに拡張
- `type="button"`: 通常のボタン（フォーム送信しない）
- `variant="outline"`: アウトラインスタイル
- `asChild`: 子要素（a タグ）をボタンとして使用
- なぜ必要？: フォーム送信とキャンセル機能の提供

### 6. ページコンポーネントの作成

**ファイル**: `[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "../_repository/productRepository";
import ProductUpdateForm from "../_presentational/ProductUpdateForm";

type ProductUpdatePageProps = {
	params: Promise<{ id: string }>;
};

export default async function ProductUpdatePage({
	params,
}: ProductUpdatePageProps) {
	const { id } = await params;
	const productId = parseInt(id);

	if (isNaN(productId)) {
		notFound();
	}

	const product = await getProductById(productId);

	if (!product) {
		notFound();
	}
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						✏️ T4. Update（更新）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						商品を更新しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							フォームを編集して商品を更新できます
						</span>
					</p>
				</div>

				{/* 戻るボタン */}
				<div className="mb-6">
					<Link
						href="/t2-read-list/products"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 商品リストに戻る
					</Link>
				</div>

				{/* フォーム */}
				<ProductUpdateForm product={product} />
			</div>
		</div>
	);
}
```

**一行ずつの詳細解説**:

```typescript
import { notFound } from "next/navigation";
```

- Next.js の notFound 関数をインポート
- なぜ必要？: 商品が見つからない場合に 404 ページを表示

```typescript
import Link from "next/link";
```

- Next.js の Link コンポーネントをインポート
- なぜ必要？: クライアントサイドルーティングでページ遷移

```typescript
import { getProductById } from "../_repository/productRepository";
```

- 商品取得関数をインポート
- なぜ必要？: 指定された ID の商品データを取得

```typescript
import ProductUpdateForm from "../_presentational/ProductUpdateForm";
```

- 更新フォームコンポーネントをインポート
- なぜ必要？: 商品更新用の UI を表示

```typescript
type ProductUpdatePageProps = {
	params: Promise<{ id: string }>;
};
```

- ページコンポーネントの props の型定義
- `Promise<{ id: string }>`: App Router では params が非同期で取得される
- なぜ必要？: TypeScript の型安全性を保証

```typescript
export default async function ProductUpdatePage({
	params,
}: ProductUpdatePageProps) {
```

- デフォルトエクスポートの非同期関数コンポーネント
- `async`: Server Component として非同期処理を実行
- `{ params }`: props から params を分割代入で取得
- なぜ必要？: サーバーサイドで商品データを取得してページを生成

```typescript
const { id } = await params;
```

- params から id を非同期で取得
- `await`: Promise の解決を待つ
- なぜ必要？: URL パラメータから商品 ID を取得

```typescript
const productId = parseInt(id);
```

- 文字列の id を数値に変換
- なぜ必要？: データベースの ID は数値型なので、型変換が必要

```typescript
if (isNaN(productId)) {
	notFound();
}
```

- 数値変換に失敗した場合の処理
- `isNaN()`: 数値でないかどうかを判定
- `notFound()`: 404 ページを表示
- なぜ必要？: 無効な ID でアクセスされた場合のエラーハンドリング

```typescript
const product = await getProductById(productId);
```

- 指定された ID の商品データを取得
- `await`: 非同期処理の完了を待つ
- なぜ必要？: 更新対象の商品データを取得

```typescript
if (!product) {
	notFound();
}
```

- 商品が存在しない場合の処理
- `!product`: product が null または undefined の場合
- なぜ必要？: 存在しない商品 ID でアクセスされた場合のエラーハンドリング

```typescript
	return (
		<div className="min-h-screen bg-background">
```

- ページのルート要素
- `min-h-screen`: 最小高さを画面の高さに設定
- `bg-background`: 背景色をテーマ変数で設定
- なぜ必要？: ページ全体のレイアウトと背景色の設定

```typescript
			<div className="container mx-auto px-4 py-8">
```

- コンテナ要素
- `container`: 最大幅を設定
- `mx-auto`: 左右のマージンを自動（中央揃え）
- `px-4`: 左右のパディング
- `py-8`: 上下のパディング
- なぜ必要？: コンテンツの幅制限と中央配置、適切な余白

```typescript
				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
```

- ヘッダーセクション
- `mb-12`: 下のマージンを大きく設定
- `text-center`: テキストを中央揃え
- なぜ必要？: ページのタイトル部分のレイアウト

```typescript
<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
	✏️ T4. Update（更新）
</h1>
```

- メインタイトル
- `text-4xl`: 大きなフォントサイズ
- `font-bold`: 太字
- `bg-gradient-to-r`: 左から右へのグラデーション
- `from-primary to-primary/70`: プライマリ色から 70%透明度のプライマリ色へ
- `bg-clip-text`: 背景をテキストの形にクリップ
- `text-transparent`: テキストを透明にして背景を表示
- なぜ必要？: 視覚的に魅力的なタイトル表示

```typescript
<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
	商品を更新しましょう
	<br />
	<span className="text-sm text-muted-foreground/80">
		フォームを編集して商品を更新できます
	</span>
</p>
```

- 説明文
- `text-muted-foreground`: 薄い色のテキスト
- `text-lg`: 大きなフォントサイズ
- `max-w-2xl`: 最大幅を制限
- `mx-auto`: 中央揃え
- `leading-relaxed`: 行間を広く設定
- なぜ必要？: ページの目的と使い方を説明

```typescript
{
	/* 戻るボタン */
}
<div className="mb-6">
	<Link
		href="/t2-read-list/products"
		className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
	>
		← 商品リストに戻る
	</Link>
</div>;
```

- 戻るボタン
- `mb-6`: 下のマージン
- `inline-flex`: インラインフレックス
- `items-center`: 子要素を垂直中央揃え
- `text-sm`: 小さなフォントサイズ
- `hover:text-primary`: ホバー時にプライマリ色に変更
- `transition-colors`: 色の変化をアニメーション
- なぜ必要？: ユーザーが商品一覧に戻れるようにする

```typescript
{
	/* フォーム */
}
<ProductUpdateForm product={product} />;
```

- 更新フォームコンポーネント
- `product={product}`: 取得した商品データを props として渡す
- なぜ必要？: 商品更新用のフォームを表示し、既存データで初期化

## 🔄 処理の流れ

### 1. ページアクセス

```
ユーザーが /t4-update/product/1 にアクセス
↓
ProductUpdatePage コンポーネントが実行
↓
URLパラメータから商品IDを取得
↓
getProductById で商品データを取得
↓
ProductUpdateForm に商品データを渡して表示
```

### 2. フォーム送信

```
ユーザーがフォームを編集して「商品を更新」ボタンをクリック
↓
updateProductAction Server Action が実行
↓
FormData から入力データを取得
↓
updateProductSchema でバリデーション
↓
updateProduct でデータベースを更新
↓
revalidateTag でキャッシュを無効化
↓
redirect で商品一覧ページにリダイレクト
```

## 🎨 UI/UX の特徴

### shadcn/ui + Tailwind CSS

- **統一されたデザイン**: shadcn/ui のコンポーネントで一貫性を保持
- **ダークテーマ対応**: 目に優しいダークテーマをデフォルトに
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **ホバーエフェクト**: インタラクティブな要素にホバー効果を追加

### アクセシビリティ

- **セマンティック HTML**: 適切な HTML タグを使用
- **ラベルとフォームの関連付け**: `htmlFor`と`id`で関連付け
- **キーボードナビゲーション**: すべての要素がキーボードで操作可能

## 🔧 技術的なポイント

### 型安全性

- **TypeScript**: コンパイル時にエラーを検出
- **Zod**: ランタイムバリデーションと型推論
- **Prisma**: データベーススキーマと型の同期

### パフォーマンス

- **Server Components**: サーバーサイドレンダリングで初期表示を高速化
- **Server Actions**: フォーム送信時のページリロードを回避
- **キャッシュ管理**: `revalidateTag`で効率的なキャッシュ更新

### セキュリティ

- **バリデーション**: 入力データの検証
- **SQL インジェクション対策**: Prisma のパラメータ化クエリ
- **CSRF 対策**: Next.js の Server Actions が自動的に提供

## 📚 学習ポイント

### App Router の概念

- **Server Components**: サーバーサイドで実行されるコンポーネント
- **Server Actions**: フォーム送信やデータ更新のためのサーバーサイド関数
- **動的ルーティング**: `[id]`フォルダで動的な URL パラメータを処理

### ドメイン駆動設計

- **層の分離**: DTO、Repository、Action、Presentational の責任分離
- **関心の分離**: 各層が特定の責任を持つ
- **再利用性**: 各層が独立してテスト・再利用可能

### モダンな React/Next.js

- **関数型プログラミング**: クラスではなく関数コンポーネント
- **型推論**: TypeScript の型推論を活用
- **宣言的 UI**: 状態に基づいて UI を宣言的に記述

この実装により、保守性が高く、拡張しやすい商品更新機能が完成します。

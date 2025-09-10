# 🗑️ 商品削除機能の実装手順

## 📋 実装手順（全 6 ステップ）

### 1. DTO ファイルの作成（型定義）

**目的**: 商品データの型定義を作成し、削除対象の情報を型安全に扱う

**ファイル**: `src/app/t5-delete/product/_dto/product.ts`

```typescript
export type Product = {
	id: number; // 商品ID（主キー）
	name: string; // 商品名
	category: string; // カテゴリ
	price: number; // 価格
	stock: number; // 在庫数
	createdAt: Date; // 作成日時
};
```

**処理の説明**:

- 商品削除時に必要な全フィールドを型定義
- 削除確認画面で表示する情報を明確化
- TypeScript の型安全性を確保

---

### 2. スキーマファイルの作成（バリデーション）

**目的**: 削除用のバリデーションルールを定義し、ID の妥当性をチェック

**ファイル**: `src/app/t5-delete/product/_schema/product.ts`

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

**処理の説明**:

- Zod スキーマで ID のバリデーションルールを定義
- 整数かつ正の数であることをチェック
- `z.infer`で TypeScript の型を自動生成
- エラーメッセージを日本語で設定

---

### 3. リポジトリファイルの作成（DB 操作）

**目的**: データベースから商品取得・削除を行う（query raw で SQL 実行）

**ファイル**: `src/app/t5-delete/product/_repository/productRepository.ts`

```typescript
import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { DeleteProductInput } from "../_schema/product";

// 商品取得関数（削除確認用）
export async function getProductById(id: number): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
		SELECT id, name, category, price, stock, created_at as "createdAt"
		FROM "products"
		WHERE id = ${id}
	`;

	return product[0] || null;
}

// 商品削除関数
export async function deleteProduct(
	data: DeleteProductInput
): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
		DELETE FROM "products"
		WHERE id = ${data.id}
		RETURNING id, name, category, price, stock, created_at as "createdAt"
	`;

	return product[0] || null;
}
```

**処理の説明**:

- `getProductById`: 削除確認用に商品データを取得
- `deleteProduct`: 指定された ID の商品を削除
- `query raw`で生 SQL を実行（Prisma ORM は使用しない）
- `RETURNING`句で削除されたデータを返却
- 型安全性を保つため`Product[]`で型指定

---

### 4. アクションファイルの作成（Server Action）

**目的**: 削除処理のビジネスロジック（バリデーション → 削除 → リダイレクト）

**ファイル**: `src/app/t5-delete/product/_action/product.ts`

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
	deleteProductSchema,
	type DeleteProductInput,
} from "../_schema/product";
import { deleteProduct } from "../_repository/productRepository";

export async function deleteProductAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
	};

	// バリデーション実行
	const validatedData = deleteProductSchema.parse(rawData);

	// データベースから削除
	await deleteProduct(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
}
```

**処理の説明**:

- `"use server"`でサーバー側実行を指定
- フォームデータから ID を取得して整数に変換
- Zod スキーマでバリデーション実行
- バリデーション済みデータで商品を削除
- `revalidateTag`でキャッシュを無効化
- `redirect`で商品一覧ページに自動遷移

---

### 5. プレゼンテーションファイルの作成（UI）

**目的**: 削除確認 UI を作成し、危険性を視覚的に表現

**ファイル**: `src/app/t5-delete/product/_presentational/ProductDeleteDialog.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProductAction } from "../_action/product";
import type { Product } from "../_dto/product";
import Link from "next/link";

type ProductDeleteDialogProps = {
	product: Product;
};

export function ProductDeleteDialog({ product }: ProductDeleteDialogProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-destructive">
					🗑️ 商品を削除
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 削除対象の商品情報 */}
					<div className="p-4 bg-muted/50 rounded-lg border">
						<h3 className="font-semibold mb-2">削除対象の商品</h3>
						<div className="space-y-2 text-sm">
							<p>
								<span className="font-medium">ID:</span> {product.id}
							</p>
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
							</p>
							<p>
								<span className="font-medium">作成日:</span>{" "}
								{product.createdAt.toLocaleDateString("ja-JP")}
							</p>
						</div>
					</div>

					{/* 警告メッセージ */}
					<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
						<p className="text-destructive font-medium">
							⚠️ この操作は取り消せません
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							商品を削除すると、すべてのデータが完全に削除されます。
						</p>
					</div>

					{/* 削除ボタン */}
					<form action={deleteProductAction}>
						<input type="hidden" name="id" value={product.id} />
						<Button type="submit" variant="destructive" className="w-full">
							商品を削除する
						</Button>
					</form>

					{/* 戻るボタン */}
					<Button variant="outline" asChild className="w-full">
						<Link href="/t2-read-list/products">キャンセル</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
```

**処理の説明**:

- `"use client"`でクライアントコンポーネントとして実行
- 削除対象の商品情報を詳細表示
- 警告メッセージで削除の危険性を強調
- `destructive`色で視覚的に危険性を表現
- フォームで Server Action を実行
- 隠しフィールドで商品 ID を送信

---

### 6. ページファイルの作成（ルーティング）

**目的**: 削除ページのルーティング（ID 取得 → データ取得 →UI 表示）

**ファイル**: `src/app/t5-delete/product/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";

import { getProductById } from "../_repository/productRepository";
import { ProductDeleteDialog } from "../_presentational/ProductDeleteDialog";

type ProductDeletePageProps = {
	params: Promise<{ id: string }>;
};

export default async function ProductDeletePage({
	params,
}: ProductDeletePageProps) {
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
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
						🗑️ T5. Delete（削除）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						商品を削除しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							削除する前に内容を確認してください
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

				{/* 削除確認ダイアログ */}
				<ProductDeleteDialog product={product} />
			</div>
		</div>
	);
}
```

**処理の説明**:

- Server Component として非同期で実行
- URL パラメータから商品 ID を取得
- ID が数値でない場合は 404 ページを表示
- データベースから商品データを取得
- 商品が見つからない場合は 404 ページを表示
- 削除確認ダイアログに商品データを渡して表示

---

## 🔄 処理の流れ

```
1. URLパラメータから商品ID取得
   ↓
2. 商品データ取得（getProductById）
   ↓
3. 削除確認画面表示（ProductDeleteDialog）
   ↓
4. 削除ボタンクリック
   ↓
5. Server Action実行（deleteProductAction）
   ↓
6. バリデーション実行（deleteProductSchema）
   ↓
7. DB削除（deleteProduct）
   ↓
8. キャッシュ無効化（revalidateTag）
   ↓
9. 一覧ページリダイレクト（redirect）
```

## 🎨 使用する shadcn/ui コンポーネント

- **Card**: 削除確認のコンテナ表示
- **Button**: 削除・キャンセル操作
- **Link**: ナビゲーション

## 🎨 使用する Tailwind クラス

- **レイアウト**: `max-w-2xl mx-auto`, `container mx-auto px-4 py-8`
- **余白**: `space-y-6`, `mb-12`, `mb-6`, `p-4`
- **色**: `bg-destructive/10`, `text-destructive`, `text-muted-foreground`
- **装飾**: `rounded-lg`, `border`, `bg-clip-text text-transparent`
- **サイズ**: `text-4xl`, `text-2xl`, `text-lg`, `text-sm`
- **配置**: `text-center`, `w-full`

## ⚠️ 注意点

1. **型安全性**: 全てのファイルで TypeScript の型を適切に定義
2. **エラーハンドリング**: 存在しない ID や無効な ID の場合は 404 ページを表示
3. **UI/UX**: 削除の危険性を視覚的に表現し、ユーザーに確認を求める
4. **パフォーマンス**: キャッシュ無効化で一覧ページのデータを最新に保つ
5. **セキュリティ**: Server Action でサーバー側でバリデーションを実行

---

## 🔍 コード詳細解説

### 1. DTO ファイル（型定義）の詳細解説

```typescript
export type Product = {
	id: number; // 商品ID（主キー）
	name: string; // 商品名
	category: string; // カテゴリ
	price: number; // 価格
	stock: number; // 在庫数
	createdAt: Date; // 作成日時
};
```

**各行の詳細解説**:

- `export type Product = {`

  - `export`: 他のファイルからインポート可能にする
  - `type`: TypeScript の型エイリアスを定義
  - `Product`: 型の名前（商品データを表す）
  - `= {`: オブジェクト型の定義開始

- `id: number;`

  - `id`: プロパティ名（商品の一意識別子）
  - `: number`: 型注釈（数値型であることを指定）
  - `;`: プロパティ定義の終了

- `name: string;`

  - `name`: プロパティ名（商品名）
  - `: string`: 型注釈（文字列型であることを指定）

- `category: string;`

  - `category`: プロパティ名（商品カテゴリ）
  - `: string`: 型注釈（文字列型であることを指定）

- `price: number;`

  - `price`: プロパティ名（商品価格）
  - `: number`: 型注釈（数値型であることを指定）

- `stock: number;`

  - `stock`: プロパティ名（在庫数）
  - `: number`: 型注釈（数値型であることを指定）

- `createdAt: Date;`

  - `createdAt`: プロパティ名（作成日時）
  - `: Date`: 型注釈（日付型であることを指定）

- `};`
  - `}`: オブジェクト型の定義終了
  - `;`: 型定義の終了

**なぜこの型定義が必要か**:

- 削除確認画面で表示する商品情報を明確化
- TypeScript の型安全性により、存在しないプロパティへのアクセスを防止
- 他のファイルでこの型を使用する際の一貫性を保証

---

### 2. スキーマファイル（バリデーション）の詳細解説

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

**各行の詳細解説**:

- `import { z } from "zod";`

  - `import`: 外部ライブラリをインポート
  - `{ z }`: zod ライブラリの z オブジェクトを取得
  - `from "zod"`: zod パッケージからインポート

- `export const deleteProductSchema = z.object({`

  - `export`: 他のファイルからインポート可能にする
  - `const`: 定数として定義（変更不可）
  - `deleteProductSchema`: スキーマの変数名
  - `= z.object({`: zod の object メソッドでオブジェクトスキーマを作成

- `id: z`

  - `id`: バリデーション対象のプロパティ名
  - `: z`: zod のバリデーションルールを適用

- `.number()`

  - 数値型であることをチェック
  - 文字列やブール値はエラーになる

- `.int("IDは整数で入力してください")`

  - 整数であることをチェック
  - 小数点がある場合はエラー
  - `"IDは整数で入力してください"`: エラー時のメッセージ

- `.positive("IDは正の数で入力してください")`

  - 正の数（0 より大きい）であることをチェック
  - 0 や負の数はエラー
  - `"IDは正の数で入力してください"`: エラー時のメッセージ

- `});`

  - `}`: オブジェクトスキーマの定義終了
  - `;`: 定数定義の終了

- `export type DeleteProductInput = z.infer<typeof deleteProductSchema>;`
  - `export type`: 型定義をエクスポート
  - `DeleteProductInput`: 型の名前
  - `= z.infer<typeof deleteProductSchema>`: スキーマから型を自動生成
  - `typeof deleteProductSchema`: スキーマの型を取得
  - `z.infer<>`: その型から TypeScript の型を推論

**なぜこのスキーマが必要か**:

- フォームから送信されたデータの妥当性をチェック
- 不正なデータ（文字列の ID、負の数など）を防ぐ
- エラーメッセージでユーザーに分かりやすいフィードバックを提供
- 型安全性により、バリデーション済みデータの型を保証

---

### 3. リポジトリファイル（DB 操作）の詳細解説

```typescript
import { prisma } from "@/lib/prisma";
import type { Product } from "../_dto/product";
import type { DeleteProductInput } from "../_schema/product";

// 商品取得関数（削除確認用）
export async function getProductById(id: number): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
		SELECT id, name, category, price, stock, created_at as "createdAt"
		FROM "products"
		WHERE id = ${id}
	`;

	return product[0] || null;
}

// 商品削除関数
export async function deleteProduct(
	data: DeleteProductInput
): Promise<Product | null> {
	const product = await prisma.$queryRaw<Product[]>`
		DELETE FROM "products"
		WHERE id = ${data.id}
		RETURNING id, name, category, price, stock, created_at as "createdAt"
	`;

	return product[0] || null;
}
```

**各行の詳細解説**:

#### インポート部分

- `import { prisma } from "@/lib/prisma";`

  - `import`: 外部モジュールをインポート
  - `{ prisma }`: prisma クライアントを取得
  - `from "@/lib/prisma"`: プロジェクトの lib フォルダから prisma クライアントを取得
  - `@/`: プロジェクトルートからの相対パス（tsconfig.json で設定）

- `import type { Product } from "../_dto/product";`

  - `import type`: 型のみをインポート（実行時には存在しない）
  - `{ Product }`: Product 型を取得
  - `from "../_dto/product"`: 同じ階層の\_dto フォルダから Product 型を取得

- `import type { DeleteProductInput } from "../_schema/product";`
  - `import type`: 型のみをインポート
  - `{ DeleteProductInput }`: DeleteProductInput 型を取得
  - `from "../_schema/product"`: 同じ階層の\_schema フォルダから型を取得

#### getProductById 関数

- `export async function getProductById(id: number): Promise<Product | null> {`

  - `export`: 他のファイルからインポート可能にする
  - `async`: 非同期関数として定義
  - `function`: 関数を定義
  - `getProductById`: 関数名（ID で商品を取得する）
  - `(id: number)`: 引数（数値型の ID を受け取る）
  - `: Promise<Product | null>`: 戻り値の型（Product または null を返す Promise）

- `const product = await prisma.$queryRaw<Product[]>`

  - `const`: 定数として定義
  - `product`: 変数名（取得した商品データを格納）
  - `= await`: 非同期処理の結果を待機
  - `prisma.$queryRaw`: Prisma の生 SQL 実行メソッド
  - `<Product[]>`: 型パラメータ（Product 型の配列を指定）

- `SELECT id, name, category, price, stock, created_at as "createdAt"`

  - `SELECT`: SQL の SELECT 文（データを取得）
  - `id, name, category, price, stock`: 取得するカラム名
  - `created_at as "createdAt"`: created_at カラムを createdAt として取得
  - `as "createdAt"`: エイリアス（JavaScript の命名規則に合わせる）

- `FROM "products"`

  - `FROM`: SQL の FROM 句（テーブルを指定）
  - `"products"`: products テーブルから取得

- `WHERE id = ${id}`

  - `WHERE`: SQL の WHERE 句（条件を指定）
  - `id = ${id}`: id カラムが引数の id と一致するレコードを取得
  - `${id}`: テンプレートリテラルで変数を埋め込み

- `return product[0] || null;`
  - `return`: 関数の戻り値を指定
  - `product[0]`: 配列の最初の要素（商品データ）
  - `|| null`: 配列が空の場合は null を返す
  - `;`: 文の終了

#### deleteProduct 関数

- `export async function deleteProduct(data: DeleteProductInput): Promise<Product | null> {`

  - `export`: 他のファイルからインポート可能にする
  - `async`: 非同期関数として定義
  - `function`: 関数を定義
  - `deleteProduct`: 関数名（商品を削除する）
  - `(data: DeleteProductInput)`: 引数（DeleteProductInput 型のデータを受け取る）
  - `: Promise<Product | null>`: 戻り値の型（削除された Product または null を返す Promise）

- `const product = await prisma.$queryRaw<Product[]>`

  - `const`: 定数として定義
  - `product`: 変数名（削除された商品データを格納）
  - `= await`: 非同期処理の結果を待機
  - `prisma.$queryRaw`: Prisma の生 SQL 実行メソッド
  - `<Product[]>`: 型パラメータ（Product 型の配列を指定）

- `DELETE FROM "products"`

  - `DELETE`: SQL の DELETE 文（データを削除）
  - `FROM "products"`: products テーブルから削除

- `WHERE id = ${data.id}`

  - `WHERE`: SQL の WHERE 句（条件を指定）
  - `id = ${data.id}`: id カラムが引数の data.id と一致するレコードを削除
  - `${data.id}`: テンプレートリテラルで変数を埋め込み

- `RETURNING id, name, category, price, stock, created_at as "createdAt"`

  - `RETURNING`: 削除されたレコードのデータを返す
  - `id, name, category, price, stock`: 返すカラム名
  - `created_at as "createdAt"`: created_at カラムを createdAt として返す

- `return product[0] || null;`
  - `return`: 関数の戻り値を指定
  - `product[0]`: 配列の最初の要素（削除された商品データ）
  - `|| null`: 配列が空の場合は null を返す
  - `;`: 文の終了

**なぜこのリポジトリが必要か**:

- データベース操作を一箇所に集約（関心の分離）
- 生 SQL を使用してパフォーマンスを最適化
- 型安全性により、データベース操作の安全性を保証
- 再利用可能な関数として、他の部分から呼び出し可能

---

### 4. アクションファイル（Server Action）の詳細解説

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
	deleteProductSchema,
	type DeleteProductInput,
} from "../_schema/product";
import { deleteProduct } from "../_repository/productRepository";

export async function deleteProductAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
	};

	// バリデーション実行
	const validatedData = deleteProductSchema.parse(rawData);

	// データベースから削除
	await deleteProduct(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
}
```

**各行の詳細解説**:

#### ファイル全体の設定

- `"use server";`
  - Next.js の Server Action ディレクティブ
  - このファイル内の関数をサーバー側で実行することを指定
  - クライアント側では実行されない

#### インポート部分

- `import { revalidateTag } from "next/cache";`

  - `import`: 外部モジュールをインポート
  - `{ revalidateTag }`: Next.js のキャッシュ無効化関数を取得
  - `from "next/cache"`: Next.js のキャッシュ管理モジュールから取得

- `import { redirect } from "next/navigation";`

  - `import`: 外部モジュールをインポート
  - `{ redirect }`: Next.js のリダイレクト関数を取得
  - `from "next/navigation"`: Next.js のナビゲーションモジュールから取得

- `import { deleteProductSchema, type DeleteProductInput } from "../_schema/product";`

  - `import`: 外部モジュールをインポート
  - `{ deleteProductSchema }`: バリデーションスキーマを取得
  - `type DeleteProductInput`: 型定義を取得
  - `from "../_schema/product"`: 同じ階層の\_schema フォルダから取得

- `import { deleteProduct } from "../_repository/productRepository";`
  - `import`: 外部モジュールをインポート
  - `{ deleteProduct }`: 商品削除関数を取得
  - `from "../_repository/productRepository"`: 同じ階層の\_repository フォルダから取得

#### deleteProductAction 関数

- `export async function deleteProductAction(formData: FormData) {`
  - `export`: 他のファイルからインポート可能にする
  - `async`: 非同期関数として定義
  - `function`: 関数を定義
  - `deleteProductAction`: 関数名（商品削除アクション）
  - `(formData: FormData)`: 引数（フォームデータを受け取る）
  - `FormData`: ブラウザの FormData オブジェクトの型

#### フォームデータの変換

- `const rawData = {`

  - `const`: 定数として定義
  - `rawData`: 変数名（生のデータを格納）
  - `= {`: オブジェクトリテラルの開始

- `id: parseInt(formData.get("id") as string),`

  - `id`: プロパティ名（商品 ID）
  - `: parseInt()`: 文字列を整数に変換する関数
  - `formData.get("id")`: フォームから"id"フィールドの値を取得
  - `as string`: 型アサーション（文字列として扱う）
  - `,`: プロパティの区切り

- `};`
  - `}`: オブジェクトリテラルの終了
  - `;`: 文の終了

#### バリデーション実行

- `const validatedData = deleteProductSchema.parse(rawData);`
  - `const`: 定数として定義
  - `validatedData`: 変数名（バリデーション済みデータを格納）
  - `= deleteProductSchema.parse()`: スキーマでバリデーションを実行
  - `(rawData)`: バリデーション対象のデータ
  - `;`: 文の終了

#### データベース削除

- `await deleteProduct(validatedData);`
  - `await`: 非同期処理の結果を待機
  - `deleteProduct()`: 商品削除関数を呼び出し
  - `(validatedData)`: バリデーション済みデータを渡す
  - `;`: 文の終了

#### キャッシュ無効化

- `revalidateTag("products");`
  - `revalidateTag()`: Next.js のキャッシュ無効化関数
  - `("products")`: "products"タグのキャッシュを無効化
  - 商品一覧ページのデータが最新になる
  - `;`: 文の終了

#### リダイレクト

- `redirect("/t2-read-list/products");`
  - `redirect()`: Next.js のリダイレクト関数
  - `("/t2-read-list/products")`: 商品一覧ページに遷移
  - 削除完了後に自動的に一覧ページに移動
  - `;`: 文の終了

**なぜこのアクションが必要か**:

- フォーム送信から削除完了までの一連の処理を管理
- バリデーション、削除、キャッシュ無効化、リダイレクトを順序立てて実行
- Server Action により、サーバー側で安全に処理を実行
- ユーザーエクスペリエンスを向上（削除後の自動リダイレクト）

---

### 5. プレゼンテーションファイル（UI）の詳細解説

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProductAction } from "../_action/product";
import type { Product } from "../_dto/product";
import Link from "next/link";

type ProductDeleteDialogProps = {
	product: Product;
};

export function ProductDeleteDialog({ product }: ProductDeleteDialogProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-destructive">
					🗑️ 商品を削除
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 削除対象の商品情報 */}
					<div className="p-4 bg-muted/50 rounded-lg border">
						<h3 className="font-semibold mb-2">削除対象の商品</h3>
						<div className="space-y-2 text-sm">
							<p>
								<span className="font-medium">ID:</span> {product.id}
							</p>
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
							</p>
							<p>
								<span className="font-medium">作成日:</span>{" "}
								{product.createdAt.toLocaleDateString("ja-JP")}
							</p>
						</div>
					</div>

					{/* 警告メッセージ */}
					<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
						<p className="text-destructive font-medium">
							⚠️ この操作は取り消せません
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							商品を削除すると、すべてのデータが完全に削除されます。
						</p>
					</div>

					{/* 削除ボタン */}
					<form action={deleteProductAction}>
						<input type="hidden" name="id" value={product.id} />
						<Button type="submit" variant="destructive" className="w-full">
							商品を削除する
						</Button>
					</form>

					{/* 戻るボタン */}
					<Button variant="outline" asChild className="w-full">
						<Link href="/t2-read-list/products">キャンセル</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
```

**各行の詳細解説**:

#### ファイル全体の設定

- `"use client";`
  - Next.js の Client Component ディレクティブ
  - このファイル内のコンポーネントをクライアント側で実行することを指定
  - ブラウザで JavaScript が実行される

#### インポート部分

- `import { Button } from "@/components/ui/button";`

  - `import`: 外部モジュールをインポート
  - `{ Button }`: shadcn/ui の Button コンポーネントを取得
  - `from "@/components/ui/button"`: プロジェクトの UI コンポーネントから取得

- `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`

  - `import`: 外部モジュールをインポート
  - `{ Card, CardContent, CardHeader, CardTitle }`: shadcn/ui の Card 関連コンポーネントを取得
  - `from "@/components/ui/card"`: プロジェクトの UI コンポーネントから取得

- `import { deleteProductAction } from "../_action/product";`

  - `import`: 外部モジュールをインポート
  - `{ deleteProductAction }`: 商品削除アクションを取得
  - `from "../_action/product"`: 同じ階層の\_action フォルダから取得

- `import type { Product } from "../_dto/product";`

  - `import type`: 型のみをインポート
  - `{ Product }`: Product 型を取得
  - `from "../_dto/product"`: 同じ階層の\_dto フォルダから取得

- `import Link from "next/link";`
  - `import`: 外部モジュールをインポート
  - `Link`: Next.js の Link コンポーネントを取得
  - `from "next/link"`: Next.js のナビゲーションモジュールから取得

#### 型定義

- `type ProductDeleteDialogProps = {`

  - `type`: TypeScript の型エイリアスを定義
  - `ProductDeleteDialogProps`: 型の名前（コンポーネントのプロパティ型）
  - `= {`: オブジェクト型の定義開始

- `product: Product;`

  - `product`: プロパティ名（商品データ）
  - `: Product`: 型注釈（Product 型であることを指定）
  - `;`: プロパティ定義の終了

- `};`
  - `}`: オブジェクト型の定義終了
  - `;`: 型定義の終了

#### コンポーネント定義

- `export function ProductDeleteDialog({ product }: ProductDeleteDialogProps) {`
  - `export`: 他のファイルからインポート可能にする
  - `function`: 関数を定義
  - `ProductDeleteDialog`: 関数名（商品削除ダイアログコンポーネント）
  - `({ product })`: 引数（分割代入で product を取得）
  - `: ProductDeleteDialogProps`: 引数の型注釈

#### カードコンテナ

- `<Card className="max-w-2xl mx-auto">`
  - `<Card>`: shadcn/ui の Card コンポーネント
  - `className="max-w-2xl mx-auto"`: Tailwind クラス
    - `max-w-2xl`: 最大幅を 2xl（672px）に設定
    - `mx-auto`: 左右のマージンを自動（中央配置）

#### カードヘッダー

- `<CardHeader>`

  - `<CardHeader>`: shadcn/ui の CardHeader コンポーネント
  - カードのヘッダー部分を定義

- `<CardTitle className="text-2xl font-bold text-destructive">`

  - `<CardTitle>`: shadcn/ui の CardTitle コンポーネント
  - `className="text-2xl font-bold text-destructive"`: Tailwind クラス
    - `text-2xl`: フォントサイズを 2xl に設定
    - `font-bold`: フォントウェイトを太字に設定
    - `text-destructive`: テキスト色を削除色（赤系）に設定

- `🗑️ 商品を削除`
  - カードタイトルのテキスト
  - 絵文字で視覚的に削除操作を表現

#### カードコンテンツ

- `<CardContent>`

  - `<CardContent>`: shadcn/ui の CardContent コンポーネント
  - カードの内容部分を定義

- `<div className="space-y-6">`
  - `<div>`: HTML の div 要素
  - `className="space-y-6"`: Tailwind クラス
    - `space-y-6`: 子要素間に 6（24px）の縦の余白を設定

#### 商品情報表示エリア

- `<div className="p-4 bg-muted/50 rounded-lg border">`

  - `<div>`: HTML の div 要素
  - `className="p-4 bg-muted/50 rounded-lg border"`: Tailwind クラス
    - `p-4`: パディングを 4（16px）に設定
    - `bg-muted/50`: 背景色を薄いグレーに設定
    - `rounded-lg`: 角丸を lg サイズに設定
    - `border`: ボーダーを表示

- `<h3 className="font-semibold mb-2">削除対象の商品</h3>`

  - `<h3>`: HTML の h3 要素（見出し）
  - `className="font-semibold mb-2"`: Tailwind クラス
    - `font-semibold`: フォントウェイトをセミボールドに設定
    - `mb-2`: 下マージンを 2（8px）に設定

- `<div className="space-y-2 text-sm">`
  - `<div>`: HTML の div 要素
  - `className="space-y-2 text-sm"`: Tailwind クラス
    - `space-y-2`: 子要素間に 2（8px）の縦の余白を設定
    - `text-sm`: フォントサイズを小さいサイズに設定

#### 商品情報の表示

- `<p><span className="font-medium">ID:</span> {product.id}</p>`

  - `<p>`: HTML の p 要素（段落）
  - `<span className="font-medium">`: フォントウェイトを中太字に設定
  - `{product.id}`: 商品 ID を表示（JSX の式）

- `<p><span className="font-medium">商品名:</span> {product.name}</p>`

  - 商品名を表示

- `<p><span className="font-medium">カテゴリ:</span> {product.category}</p>`

  - カテゴリを表示

- `<p><span className="font-medium">価格:</span> ¥{product.price.toLocaleString()}</p>`

  - 価格を表示
  - `toLocaleString()`: 数値をカンマ区切りでフォーマット

- `<p><span className="font-medium">在庫数:</span> {product.stock}</p>`

  - 在庫数を表示

- `<p><span className="font-medium">作成日:</span> {product.createdAt.toLocaleDateString("ja-JP")}</p>`
  - 作成日を表示
  - `toLocaleDateString("ja-JP")`: 日付を日本語形式でフォーマット

#### 警告メッセージ

- `<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">`

  - `<div>`: HTML の div 要素
  - `className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"`: Tailwind クラス
    - `p-4`: パディングを 4（16px）に設定
    - `bg-destructive/10`: 背景色を削除色の薄い版に設定
    - `border border-destructive/20`: ボーダーを削除色の薄い版に設定
    - `rounded-lg`: 角丸を lg サイズに設定

- `<p className="text-destructive font-medium">⚠️ この操作は取り消せません</p>`

  - `<p>`: HTML の p 要素（段落）
  - `className="text-destructive font-medium"`: Tailwind クラス
    - `text-destructive`: テキスト色を削除色に設定
    - `font-medium`: フォントウェイトを中太字に設定

- `<p className="text-sm text-muted-foreground mt-1">商品を削除すると、すべてのデータが完全に削除されます。</p>`
  - `<p>`: HTML の p 要素（段落）
  - `className="text-sm text-muted-foreground mt-1"`: Tailwind クラス
    - `text-sm`: フォントサイズを小さいサイズに設定
    - `text-muted-foreground`: テキスト色を薄い色に設定
    - `mt-1`: 上マージンを 1（4px）に設定

#### 削除フォーム

- `<form action={deleteProductAction}>`

  - `<form>`: HTML の form 要素
  - `action={deleteProductAction}`: フォーム送信時に Server Action を実行

- `<input type="hidden" name="id" value={product.id} />`

  - `<input>`: HTML の input 要素
  - `type="hidden"`: 隠しフィールドとして設定
  - `name="id"`: フィールド名を"id"に設定
  - `value={product.id}`: 商品 ID を値として設定

- `<Button type="submit" variant="destructive" className="w-full">`

  - `<Button>`: shadcn/ui の Button コンポーネント
  - `type="submit"`: フォーム送信ボタンとして設定
  - `variant="destructive"`: 削除色のボタンスタイルを適用
  - `className="w-full"`: 全幅に設定

- `商品を削除する`
  - ボタンのテキスト

#### キャンセルボタン

- `<Button variant="outline" asChild className="w-full">`

  - `<Button>`: shadcn/ui の Button コンポーネント
  - `variant="outline"`: アウトラインスタイルのボタンを適用
  - `asChild`: 子要素をボタンとして扱う
  - `className="w-full"`: 全幅に設定

- `<Link href="/t2-read-list/products">キャンセル</Link>`
  - `<Link>`: Next.js の Link コンポーネント
  - `href="/t2-read-list/products"`: 商品一覧ページへのリンク
  - `キャンセル`: リンクのテキスト

**なぜこのプレゼンテーションが必要か**:

- 削除操作の危険性を視覚的に表現
- ユーザーに削除対象の商品情報を明確に提示
- 警告メッセージで誤操作を防止
- 直感的な UI/UX でユーザビリティを向上

---

### 6. ページファイル（ルーティング）の詳細解説

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";

import { getProductById } from "../_repository/productRepository";
import { ProductDeleteDialog } from "../_presentational/ProductDeleteDialog";

type ProductDeletePageProps = {
	params: Promise<{ id: string }>;
};

export default async function ProductDeletePage({
	params,
}: ProductDeletePageProps) {
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
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
						🗑️ T5. Delete（削除）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						商品を削除しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							削除する前に内容を確認してください
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

				{/* 削除確認ダイアログ */}
				<ProductDeleteDialog product={product} />
			</div>
		</div>
	);
}
```

**各行の詳細解説**:

#### インポート部分

- `import { notFound } from "next/navigation";`

  - `import`: 外部モジュールをインポート
  - `{ notFound }`: Next.js の 404 ページ表示関数を取得
  - `from "next/navigation"`: Next.js のナビゲーションモジュールから取得

- `import Link from "next/link";`

  - `import`: 外部モジュールをインポート
  - `Link`: Next.js の Link コンポーネントを取得
  - `from "next/link"`: Next.js のナビゲーションモジュールから取得

- `import { getProductById } from "../_repository/productRepository";`

  - `import`: 外部モジュールをインポート
  - `{ getProductById }`: 商品取得関数を取得
  - `from "../_repository/productRepository"`: 同じ階層の\_repository フォルダから取得

- `import { ProductDeleteDialog } from "../_presentational/ProductDeleteDialog";`
  - `import`: 外部モジュールをインポート
  - `{ ProductDeleteDialog }`: 商品削除ダイアログコンポーネントを取得
  - `from "../_presentational/ProductDeleteDialog"`: 同じ階層の\_presentational フォルダから取得

#### 型定義

- `type ProductDeletePageProps = {`

  - `type`: TypeScript の型エイリアスを定義
  - `ProductDeletePageProps`: 型の名前（ページコンポーネントのプロパティ型）
  - `= {`: オブジェクト型の定義開始

- `params: Promise<{ id: string }>;`

  - `params`: プロパティ名（URL パラメータ）
  - `: Promise<{ id: string }>`: 型注釈（非同期で id 文字列を含むオブジェクトを返す Promise）
  - `;`: プロパティ定義の終了

- `};`
  - `}`: オブジェクト型の定義終了
  - `;`: 型定義の終了

#### コンポーネント定義

- `export default async function ProductDeletePage({ params }: ProductDeletePageProps) {`
  - `export default`: デフォルトエクスポート（他のファイルからインポート可能）
  - `async`: 非同期関数として定義
  - `function`: 関数を定義
  - `ProductDeletePage`: 関数名（商品削除ページコンポーネント）
  - `({ params })`: 引数（分割代入で params を取得）
  - `: ProductDeletePageProps`: 引数の型注釈

#### URL パラメータの取得

- `const { id } = await params;`

  - `const`: 定数として定義
  - `{ id }`: 分割代入で params から id を取得
  - `= await`: 非同期処理の結果を待機
  - `params`: URL パラメータオブジェクト

- `const productId = parseInt(id);`
  - `const`: 定数として定義
  - `productId`: 変数名（商品 ID）
  - `= parseInt(id)`: 文字列の id を整数に変換

#### エラーハンドリング

- `if (isNaN(productId)) {`

  - `if`: 条件分岐
  - `isNaN(productId)`: productId が数値でないかチェック
  - `{`: 条件が真の場合の処理開始

- `notFound();`

  - `notFound()`: Next.js の 404 ページ表示関数を呼び出し
  - `;`: 文の終了

- `}`
  - `}`: 条件分岐の終了

#### 商品データの取得

- `const product = await getProductById(productId);`

  - `const`: 定数として定義
  - `product`: 変数名（商品データ）
  - `= await`: 非同期処理の結果を待機
  - `getProductById(productId)`: 商品取得関数を呼び出し

- `if (!product) {`

  - `if`: 条件分岐
  - `!product`: product が null または undefined かチェック
  - `{`: 条件が真の場合の処理開始

- `notFound();`

  - `notFound()`: Next.js の 404 ページ表示関数を呼び出し
  - `;`: 文の終了

- `}`
  - `}`: 条件分岐の終了

#### JSX の返却

- `return (`
  - `return`: 関数の戻り値を指定
  - `(`: JSX の開始

#### メインコンテナ

- `<div className="min-h-screen bg-background">`

  - `<div>`: HTML の div 要素
  - `className="min-h-screen bg-background"`: Tailwind クラス
    - `min-h-screen`: 最小高さを画面サイズに設定
    - `bg-background`: 背景色をテーマの背景色に設定

- `<div className="container mx-auto px-4 py-8">`
  - `<div>`: HTML の div 要素
  - `className="container mx-auto px-4 py-8"`: Tailwind クラス
    - `container`: コンテナクラス（最大幅を設定）
    - `mx-auto`: 左右のマージンを自動（中央配置）
    - `px-4`: 左右のパディングを 4（16px）に設定
    - `py-8`: 上下のパディングを 8（32px）に設定

#### ヘッダーセクション

- `<div className="mb-12 text-center">`

  - `<div>`: HTML の div 要素
  - `className="mb-12 text-center"`: Tailwind クラス
    - `mb-12`: 下マージンを 12（48px）に設定
    - `text-center`: テキストを中央配置

- `<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">`

  - `<h1>`: HTML の h1 要素（メイン見出し）
  - `className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent"`: Tailwind クラス
    - `text-4xl`: フォントサイズを 4xl に設定
    - `font-bold`: フォントウェイトを太字に設定
    - `mb-4`: 下マージンを 4（16px）に設定
    - `bg-gradient-to-r`: 左から右へのグラデーション
    - `from-destructive to-destructive/70`: 削除色から削除色の 70%透明度へのグラデーション
    - `bg-clip-text`: 背景をテキストにクリップ
    - `text-transparent`: テキストを透明に設定（グラデーション背景を表示）

- `🗑️ T5. Delete（削除）`

  - メインタイトルのテキスト
  - 絵文字で視覚的に削除操作を表現

- `<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">`

  - `<p>`: HTML の p 要素（段落）
  - `className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"`: Tailwind クラス
    - `text-muted-foreground`: テキスト色を薄い色に設定
    - `text-lg`: フォントサイズを lg に設定
    - `max-w-2xl`: 最大幅を 2xl（672px）に設定
    - `mx-auto`: 左右のマージンを自動（中央配置）
    - `leading-relaxed`: 行間を広めに設定

- `商品を削除しましょう`

  - 説明文のテキスト

- `<br />`

  - `<br />`: HTML の改行要素

- `<span className="text-sm text-muted-foreground/80">`

  - `<span>`: HTML の span 要素（インライン要素）
  - `className="text-sm text-muted-foreground/80"`: Tailwind クラス
    - `text-sm`: フォントサイズを小さいサイズに設定
    - `text-muted-foreground/80`: テキスト色を薄い色の 80%透明度に設定

- `削除する前に内容を確認してください`
  - 補足説明のテキスト

#### 戻るボタン

- `<div className="mb-6">`

  - `<div>`: HTML の div 要素
  - `className="mb-6"`: Tailwind クラス
    - `mb-6`: 下マージンを 6（24px）に設定

- `<Link href="/t2-read-list/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">`

  - `<Link>`: Next.js の Link コンポーネント
  - `href="/t2-read-list/products"`: 商品一覧ページへのリンク
  - `className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"`: Tailwind クラス
    - `inline-flex`: インラインフレックス表示
    - `items-center`: 子要素を垂直方向の中央に配置
    - `text-sm`: フォントサイズを小さいサイズに設定
    - `text-muted-foreground`: テキスト色を薄い色に設定
    - `hover:text-primary`: ホバー時にプライマリ色に変更
    - `transition-colors`: 色の変化にアニメーションを適用

- `← 商品リストに戻る`
  - リンクのテキスト

#### 削除確認ダイアログ

- `<ProductDeleteDialog product={product} />`
  - `<ProductDeleteDialog>`: 商品削除ダイアログコンポーネント
  - `product={product}`: 商品データをプロパティとして渡す

**なぜこのページが必要か**:

- URL パラメータから商品 ID を取得し、適切な商品データを表示
- エラーハンドリングにより、存在しない商品や無効な ID の場合は 404 ページを表示
- Server Component として、サーバー側でデータを取得してからクライアントに送信
- 削除確認画面のレイアウトとナビゲーションを提供

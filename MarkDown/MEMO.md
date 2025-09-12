# Post Create 機能 - バックエンド実装練習

## 🎯 学習目標

**投稿作成機能のバックエンド実装**を通じて、以下を学習します：

- **Server Actions** - Next.js 14 の最新機能
- **Zod バリデーション** - 型安全なデータ検証
- **Prisma Query Raw** - 生 SQL クエリでの DB 操作
- **ドメイン駆動設計** - 層別アーキテクチャ

## 📁 実装するファイル構成

```
t1-create/post/
├── _dto/post.ts          # 型定義（Post, PostListItem）
├── _schema/post.ts       # バリデーション（createPostSchema）
├── _repository/postRepository.ts  # DB操作（createPost）
├── _action/post.ts       # Server Action（createPostAction）
└── _presentational/PostForm.tsx  # UI（既存・変更不要）
```

## 🗄️ データベーススキーマ

```sql
-- PostgreSQL + Prisma Schema
enum PostCategory {
  Tech
  Life
  General
}

model Post {
  id         Int          @id @default(autoincrement())
  title      String
  body       String
  category   PostCategory
  authorId   Int          @map("author_id")
  createdAt  DateTime     @map("created_at")

  @@index([category])
  @@map("posts")
}
```

## 📋 実装手順（15 分で完了）

### Step 1: 型定義の作成（\_dto/post.ts）

**目的**: 投稿データの型安全性を確保

```typescript
import { PostCategory } from "@prisma/client";

// 投稿データの完全な型定義
export type Post = {
	id: number; // 投稿ID（主キー）
	title: string; // 投稿タイトル
	body: string; // 投稿内容
	category: PostCategory; // カテゴリ（enum型）
	authorId: number; // 作成者ID
	createdAt: Date; // 作成日時
};

// 一覧表示用の型定義（軽量化）
export type PostListItem = Pick<Post, "id" | "title" | "createdAt">;
```

**ポイント**:

- `type`を使用（interface ではなく）
- `PostCategory`は Prisma の enum 型をインポート
- `Pick`で軽量化された型も定義
- データベースのカラム名と一致させる

### Step 2: バリデーションスキーマ（\_schema/post.ts）

**目的**: フォームデータの型安全な検証

```typescript
import { z } from "zod";
import { PostCategory } from "@prisma/client";

// 新規作成用のスキーマ
export const createPostSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	body: z
		.string()
		.min(1, "本文は必須です")
		.max(5000, "本文は5000文字以内で入力してください"),
	category: z.nativeEnum(PostCategory, {
		errorMap: () => ({ message: "有効なカテゴリを選択してください" }),
	}),
	authorId: z
		.number()
		.int("著者IDは整数で入力してください")
		.positive("著者IDは正の数で入力してください"),
});

// 型推論用
export type CreatePostInput = z.infer<typeof createPostSchema>;
```

**ポイント**:

- Zod で型安全なバリデーション
- `z.nativeEnum(PostCategory)`で Prisma の enum 型を検証
- エラーメッセージを日本語で設定
- `z.infer`で型を自動生成

### Step 3: リポジトリ層（\_repository/postRepository.ts）

**目的**: データベース操作の実装

```typescript
import { prisma } from "@/lib/prisma";
import type { Post } from "../_dto/post";
import type { CreatePostInput } from "../_schema/post";

// 投稿作成関数
export async function createPost(data: CreatePostInput): Promise<Post> {
	const post = await prisma.$queryRaw<Post[]>`
    INSERT INTO "posts" (title, body, category, author_id, created_at)
    VALUES (${data.title}, ${data.body}, ${data.category}::"PostCategory", ${data.authorId}, NOW())
    RETURNING id, title, body, category, author_id as "authorId", created_at as "createdAt"
  `;

	return post[0];
}
```

**ポイント**:

- `$queryRaw`で生 SQL クエリを使用
- `::"PostCategory"`で PostgreSQL の enum 型にキャスト
- `RETURNING`で作成されたデータを取得
- カラム名のエイリアス（`author_id as "authorId"`）

### Step 4: Server Action（\_action/post.ts）

**目的**: フォーム送信処理とページ遷移

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createPostSchema } from "../_schema/post";
import { createPost } from "../_repository/postRepository";

// 投稿作成アクション
export async function createPostAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		title: formData.get("title") as string,
		body: formData.get("body") as string,
		category: formData.get("category") as string,
		authorId: parseInt(formData.get("authorId") as string),
	};

	// バリデーション実行
	const validatedData = createPostSchema.parse(rawData);

	// データベースに保存
	await createPost(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("posts");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/posts");
}
```

**ポイント**:

- `"use server"`で Server Action を宣言
- `FormData`からデータを抽出
- `revalidateTag`でキャッシュ更新
- `redirect`でページ遷移

## 🔄 データフロー

```
1. ユーザーがフォーム送信
   ↓
2. createPostAction(formData)
   ↓
3. フォームデータをオブジェクトに変換
   ↓
4. createPostSchema.parse() でバリデーション
   ↓
5. createPost() でDBに保存
   ↓
6. revalidateTag("posts") でキャッシュ更新
   ↓
7. redirect("/t2-read-list/posts") で一覧ページへ
```

## 🎨 使用技術

- **Next.js 14 App Router** - Server Actions
- **TypeScript** - 型安全性
- **Zod** - バリデーション（enum 型対応）
- **Prisma** - データベース操作（Query Raw + PostgreSQL）
- **PostgreSQL** - データベース（enum 型対応）
- **shadcn/ui + Tailwind** - UI（既存）

## ✅ 完成後の動作

1. フォームに投稿情報を入力
2. 「投稿を作成」ボタンをクリック
3. バリデーション実行
4. データベースに保存
5. 投稿一覧ページに自動遷移
6. 新しい投稿が一覧に表示される

## 🚀 次のステップ

この実装が完了したら：

- **Update 機能**の実装練習
- **Delete 機能**の実装練習
- **Read 機能**の実装練習

各機能で同じアーキテクチャパターンを繰り返し学習できます！

## ⚠️ よくあるエラーと解決方法

### PostgreSQL enum 型エラー

**エラー**: `ERROR: 列"category"は型"PostCategory"ですが、式は型textでした`

**原因**: PostgreSQL の enum 型に文字列を直接代入しようとした

**解決方法**: 型キャストを使用

```sql
-- ❌ エラー
VALUES (${data.category}, ...)

-- ✅ 解決
VALUES (${data.category}::"PostCategory", ...)
```

### シードデータの enum 値不一致

**エラー**: `Invalid value for argument 'category'. Expected ProductCategory.`

**原因**: CSV ファイルの値が Prisma スキーマの enum 値と一致しない

**解決方法**: CSV ファイルの値を enum 値に合わせて修正

```csv
# ❌ エラー
Accessories,Peripherals,Display

# ✅ 解決
Electronics,Electronics,Electronics
```

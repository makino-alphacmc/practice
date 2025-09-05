# Read 練習 - 詳細手順とコード解説

## 🎯 全体の流れ

1. **データベース** → **Repository 層** → **Server Component** → **Presentational 層** → **UI 表示**
2. **一覧表示**: 軽量データで高速表示
3. **詳細表示**: 完全データ + 404 エラーハンドリング

---

## 📁 1. 型定義（DTO 層）

### `post/_dto/post.ts`

```typescript
// 投稿データの完全な型定義
export type Post = {
	id: number; // 投稿ID（主キー）
	title: string; // 投稿タイトル
	content: string | null; // 投稿内容（null許可）
	createdAt: Date; // 作成日時
	updatedAt: Date; // 更新日時
};

// 一覧表示用の軽量型（パフォーマンス向上のため）
export type PostListItem = Pick<Post, "id" | "title" | "createdAt">;
// ↑ Post型から id, title, createdAt のみを抽出
```

**なぜ必要？**

- 型安全性の確保（TypeScript の恩恵）
- 一覧と詳細で異なるデータ量を使い分け
- インターフェース境界の明確化

---

## 🗄️ 2. データアクセス層（Repository 層）

### `post/_repository/postRepository.ts`

```typescript
import { prisma } from "@/lib/prisma";
// ↑ Prismaクライアントをインポート（DB接続用）

import type { Post, PostListItem } from "../_dto/post";
// ↑ 型定義をインポート（型安全性のため）

// 投稿一覧取得関数
export async function getPostList(): Promise<PostListItem[]> {
	// ↑ 非同期関数、戻り値はPostListItemの配列

	const posts = await prisma.$queryRaw<PostListItem[]>`
    // ↑ query raw で生SQLを実行（高速化のため）
    // ↑ 型パラメータで戻り値の型を指定
    
    SELECT id, title, "createdAt" 
    // ↑ 必要な列のみ選択（軽量化）
    // ↑ "createdAt" は予約語なのでダブルクォート
    
    FROM "Post" 
    // ↑ Postテーブルから取得
    
    ORDER BY "createdAt" DESC
    // ↑ 作成日時の降順（新しい順）
  `;

	return posts;
	// ↑ 取得したデータを返す
}

// 投稿詳細取得関数
export async function getPostById(id: number): Promise<Post | null> {
	// ↑ 非同期関数、戻り値はPostまたはnull

	const post = await prisma.$queryRaw<Post[]>`
    // ↑ query raw で生SQLを実行
    // ↑ 戻り値は配列（WHERE条件で1件でも配列で返される）
    
    SELECT * FROM "Post" WHERE id = ${id}
    // ↑ 全列選択、WHERE条件でID指定
    // ↑ ${id} でパラメータ化（SQLインジェクション防止）
  `;

	return post[0] || null;
	// ↑ 配列の最初の要素を返す、なければnull
	// ↑ || null でundefinedをnullに変換
}
```

**なぜ query raw？**

- パフォーマンス向上（ORM のオーバーヘッドなし）
- 複雑なクエリも直接記述可能
- 型安全性は保持される

---

## 🎨 3. UI 表示層（Presentational 層）

### `post/_presentational/PostCard.tsx`

```typescript
import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのCardコンポーネント群

import type { PostListItem } from "../_dto/post";
// ↑ 型定義をインポート

type PostCardProps = {
	post: PostListItem; // プロパティの型定義
};

export function PostCard({ post }: PostCardProps) {
	// ↑ 関数コンポーネント、propsでpostを受け取る

	return (
		<Link href={`/posts/${post.id}`}>
			// ↑ クリックで詳細ページに遷移 // ↑ テンプレートリテラルで動的URL生成
			<Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
				// ↑ Cardコンポーネント // ↑ hover:shadow-lg: ホバー時に影を大きく // ↑
				transition-shadow: 影の変化をアニメーション // ↑ duration-200:
				アニメーション時間200ms // ↑ cursor-pointer:
				マウスカーソルをポインターに
				<CardHeader className="pb-3">
					// ↑ カードヘッダー、padding-bottomを3に設定
					<CardTitle className="text-lg line-clamp-2">
						// ↑ カードタイトル // ↑ text-lg: フォントサイズ大 // ↑
						line-clamp-2: 2行で省略表示
						{post.title}
						// ↑ 投稿タイトルを表示
					</CardTitle>
				</CardHeader>
				<CardContent>
					// ↑ カードコンテンツ部分
					<p className="text-sm text-muted-foreground">
						// ↑ 段落要素 // ↑ text-sm: フォントサイズ小 // ↑
						text-muted-foreground: 薄い色（shadcn/uiのテーマ変数）
						{post.createdAt.toLocaleDateString("ja-JP")}
						// ↑ 作成日時を日本語形式で表示 // ↑ toLocaleDateString:
						ロケールに応じた日付フォーマット
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
```

### `post/_presentational/PostList.tsx`

```typescript
import { PostCard } from "./PostCard";
// ↑ PostCardコンポーネントをインポート

import type { PostListItem } from "../_dto/post";
// ↑ 型定義をインポート

type PostListProps = {
	posts: PostListItem[]; // プロパティの型定義
};

export function PostList({ posts }: PostListProps) {
	// ↑ 関数コンポーネント、posts配列を受け取る

	if (posts.length === 0) {
		// ↑ 投稿が0件の場合の処理

		return (
			<div className="text-center py-12">
				// ↑ 中央揃え、上下にpadding 12
				<p className="text-muted-foreground">投稿がありません</p>
				// ↑ 薄い色でメッセージ表示
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			// ↑ グリッドレイアウト // ↑ gap-6: グリッドアイテム間の間隔 // ↑
			md:grid-cols-2: 中サイズ以上で2列 // ↑ lg:grid-cols-3: 大サイズ以上で3列
			{posts.map((post) => (
				// ↑ posts配列をmapでループ処理

				<PostCard key={post.id} post={post} />
				// ↑ PostCardコンポーネントをレンダリング
				// ↑ key={post.id}: Reactのkey属性（パフォーマンス最適化）
				// ↑ post={post}: 各投稿データを渡す
			))}
		</div>
	);
}
```

### `post/_presentational/PostDetail.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ↑ shadcn/uiのCardコンポーネント群

import type { Post } from "../_dto/post";
// ↑ 型定義をインポート

type PostDetailProps = {
	post: Post; // プロパティの型定義
};

export function PostDetail({ post }: PostDetailProps) {
	// ↑ 関数コンポーネント、postを受け取る

	return (
		<Card className="max-w-4xl mx-auto">
			// ↑ Cardコンポーネント // ↑ max-w-4xl: 最大幅を4xlに設定 // ↑ mx-auto:
			左右のマージンを自動（中央揃え）
			<CardHeader>
				// ↑ カードヘッダー
				<CardTitle className="text-2xl">{post.title}</CardTitle>
				// ↑ カードタイトル、フォントサイズ2xl
				<p className="text-sm text-muted-foreground">
					// ↑ 段落要素、薄い色
					{post.createdAt.toLocaleDateString("ja-JP")}
					// ↑ 作成日時を日本語形式で表示
				</p>
			</CardHeader>
			<CardContent>
				// ↑ カードコンテンツ
				<div className="prose prose-invert max-w-none">
					// ↑ prose: リッチテキスト用のスタイル // ↑ prose-invert:
					ダークテーマ用のprose // ↑ max-w-none: 最大幅制限を解除
					{post.content ? (
						// ↑ コンテンツが存在する場合
						<p className="whitespace-pre-wrap">{post.content}</p>
					) : (
						// ↑ 段落要素
						// ↑ whitespace-pre-wrap: 改行とスペースを保持
						// ↑ コンテンツが存在しない場合
						<p className="text-muted-foreground italic">内容がありません</p>
						// ↑ 薄い色、イタリック体でメッセージ表示
					)}
				</div>
			</CardContent>
		</Card>
	);
}
```

---

## 🌐 4. ページ層（Server Components）

### `app/posts/page.tsx`

```typescript
import { getPostList } from "@/post/_repository/postRepository";
// ↑ Repository層の関数をインポート

import { PostList } from "@/post/_presentational/PostList";
// ↑ Presentational層のコンポーネントをインポート

export default async function PostsPage() {
	// ↑ デフォルトエクスポートの非同期関数
	// ↑ Server Component（サーバーサイドで実行）

	const posts = await getPostList();
	// ↑ Repository層でデータ取得
	// ↑ await: 非同期処理の完了を待つ

	return (
		<div className="container mx-auto px-4 py-8">
			// ↑ コンテナ要素 // ↑ container: 最大幅を設定 // ↑ mx-auto:
			左右のマージンを自動（中央揃え） // ↑ px-4: 左右のパディング // ↑ py-8:
			上下のパディング
			<h1 className="text-3xl font-bold mb-8">投稿一覧</h1>
			// ↑ 見出し要素 // ↑ text-3xl: フォントサイズ3xl // ↑ font-bold:
			フォントウェイト太字 // ↑ mb-8: 下のマージン
			<PostList posts={posts} />
			// ↑ PostListコンポーネントにpostsデータを渡す
		</div>
	);
}
```

### `app/posts/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
// ↑ Next.jsのnotFound関数（404ページ表示用）

import { getPostById } from "@/post/_repository/postRepository";
// ↑ Repository層の関数をインポート

import { PostDetail } from "@/post/_presentational/PostDetail";
// ↑ Presentational層のコンポーネントをインポート

type PostDetailPageProps = {
	params: Promise<{ id: string }>; // プロパティの型定義
	// ↑ paramsは非同期で取得される（App Routerの仕様）
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	// ↑ デフォルトエクスポートの非同期関数
	// ↑ Server Component（サーバーサイドで実行）

	const { id } = await params;
	// ↑ paramsからidを取得（非同期処理）

	const postId = parseInt(id);
	// ↑ 文字列のidを数値に変換

	if (isNaN(postId)) {
		// ↑ 数値変換に失敗した場合（無効なID）
		notFound();
		// ↑ 404ページを表示
	}

	const post = await getPostById(postId);
	// ↑ Repository層でデータ取得

	if (!post) {
		// ↑ 投稿が存在しない場合
		notFound();
		// ↑ 404ページを表示
	}

	return (
		<div className="container mx-auto px-4 py-8">
			// ↑ コンテナ要素（一覧ページと同じスタイル）
			<PostDetail post={post} />
			// ↑ PostDetailコンポーネントにpostデータを渡す
		</div>
	);
}
```

---

## 🎨 5. スタイル設定

### `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
// ↑ Tailwind CSSの基本設定

@layer base {
	:root {
		--background: 222.2 84% 4.9%;
		// ↑ 背景色（ダークテーマ用）
		--foreground: 210 40% 98%;
		// ↑ 前景色（テキスト色）
		--card: 222.2 84% 4.9%;
		// ↑ カード背景色
		--card-foreground: 210 40% 98%;
		// ↑ カード内テキスト色
		--muted-foreground: 215 20.2% 65.1%;
		// ↑ 薄いテキスト色
		// ↑ その他のshadcn/uiテーマ変数...
	}
}

@layer base {
	* {
		@apply border-border;
		// ↑ 全要素のボーダー色をテーマ変数に設定
	}
	body {
		@apply bg-background text-foreground;
		// ↑ body要素の背景色とテキスト色をテーマ変数に設定
	}
}
```

---

## 🔄 データの流れ

### 一覧表示の流れ

```
1. ブラウザ → /posts にアクセス
2. Server Component (PostsPage) が実行
3. getPostList() でDBから軽量データ取得
4. PostList コンポーネントでレンダリング
5. PostCard コンポーネントで各投稿を表示
6. ブラウザにHTMLが送信される
```

### 詳細表示の流れ

```
1. ブラウザ → /posts/123 にアクセス
2. Server Component (PostDetailPage) が実行
3. paramsからidを取得
4. IDの妥当性チェック（isNaN）
5. getPostById() でDBから完全データ取得
6. 投稿存在チェック（null判定）
7. PostDetail コンポーネントでレンダリング
8. ブラウザにHTMLが送信される
```

### エラーハンドリングの流れ

```
1. 無効なID → isNaN() → notFound() → 404ページ
2. 存在しないID → getPostById() → null → notFound() → 404ページ
3. 正常なID → データ取得 → 詳細表示
```

---

## 🎯 各層の責務

- **DTO 層**: 型定義のみ（データ構造の定義）
- **Repository 層**: DB 操作のみ（データの取得・保存）
- **Presentational 層**: UI 表示のみ（ビジネスロジックなし）
- **Page 層**: データ取得とコンポーネント組み合わせ（Server Component）

この構成により、各層が独立してテスト・保守でき、変更の影響範囲を最小限に抑えられます。

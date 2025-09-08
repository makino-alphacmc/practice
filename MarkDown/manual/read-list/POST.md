# 📚 読み物リスト機能 完全解説

## 概要

読み物リスト機能は、投稿の一覧表示と詳細表示を行う Next.js アプリケーションです。ユーザーは投稿一覧を閲覧し、興味のある投稿をクリックして詳細を読むことができます。

## アーキテクチャ構成

### 1. ディレクトリ構造

```
src/app/read-list/posts/
├── _dto/                    # データ転送オブジェクト（型定義）
│   └── post.ts
├── _presentational/         # プレゼンテーション層（UIコンポーネント）
│   ├── PostCard.tsx
│   ├── PostDetail.tsx
│   └── PostList.tsx
├── _repository/            # リポジトリ層（データアクセス）
│   └── postRepository.ts
├── [id]/                   # 動的ルート（詳細ページ）
│   └── page.tsx
└── page.tsx               # 一覧ページ
```

## 詳細解説

### 1. データベーススキーマ（prisma/schema.prisma）

```prisma
model Post {
  id         Int      @id
  title      String
  body       String
  category   String
  authorId   Int      @map("author_id")    // データベースの列名は author_id
  createdAt  DateTime @map("created_at")   // データベースの列名は created_at

  @@index([category])                      // category列にインデックスを作成
  @@map("posts")                          // テーブル名を posts にマッピング
}
```

**解説**:

- `@map("author_id")`: Prisma の`authorId`フィールドをデータベースの`author_id`列にマッピング
- `@map("created_at")`: Prisma の`createdAt`フィールドをデータベースの`created_at`列にマッピング
- `@@map("posts")`: Prisma の`Post`モデルをデータベースの`posts`テーブルにマッピング
- `@@index([category])`: `category`列にインデックスを作成して検索性能を向上

### 2. 型定義（\_dto/post.ts）

```typescript
// 投稿データの完全な型定義
export type Post = {
	id: number; // 投稿ID（主キー）
	title: string; // 投稿タイトル
	body: string; // 投稿内容
	category: string; // カテゴリ
	authorId: number; // 作成者ID
	createdAt: Date; // 作成日時
};

// 一覧表示用の軽量型（パフォーマンス向上のため）
export type PostListItem = Pick<Post, "id" | "title" | "createdAt">;
```

**解説**:

- `Post`: 投稿の完全なデータ構造を定義
- `PostListItem`: `Pick`ユーティリティ型を使用して、`Post`から`id`、`title`、`createdAt`のみを抽出
- 一覧表示では本文（`body`）は不要なので、軽量化のために必要なフィールドのみを選択

### 3. リポジトリ層（\_repository/postRepository.ts）

#### 3.1 一覧取得関数

```typescript
export async function getPostList(): Promise<PostListItem[]> {
	const posts = await prisma.$queryRaw<PostListItem[]>`
    SELECT id, title, created_at as "createdAt"
    FROM "posts" 
    ORDER BY created_at DESC
  `;
	return posts;
}
```

**一行ずつ解説**:

- `export async function`: 非同期関数をエクスポート（他のファイルから使用可能）
- `Promise<PostListItem[]>`: 戻り値の型を指定（PostListItem の配列を返す Promise）
- `prisma.$queryRaw`: Prisma の生 SQL クエリ実行メソッド
- `<PostListItem[]>`: 型パラメータで戻り値の型を指定
- `SELECT id, title, created_at as "createdAt"`: 必要な列のみ選択し、`created_at`を`createdAt`としてエイリアス
- `FROM "posts"`: `posts`テーブルから取得
- `ORDER BY created_at DESC`: 作成日時の降順（新しい順）で並び替え
- `return posts`: 取得したデータを返す

#### 3.2 詳細取得関数

```typescript
export async function getPostById(id: number): Promise<Post | null> {
	const post = await prisma.$queryRaw<Post[]>`
    SELECT id, title, body, category, author_id as "authorId", created_at as "createdAt"
    FROM "posts" 
    WHERE id = ${id}
  `;
	return post[0] || null;
}
```

**一行ずつ解説**:

- `Promise<Post | null>`: 戻り値は`Post`オブジェクトまたは`null`（投稿が見つからない場合）
- `SELECT id, title, body, category, author_id as "authorId", created_at as "createdAt"`: 全列を選択し、データベースの列名を Prisma のフィールド名にマッピング
- `WHERE id = ${id}`: パラメータ化クエリで SQL インジェクションを防止
- `return post[0] || null`: 配列の最初の要素を返す、なければ`null`を返す

### 4. プレゼンテーション層

#### 4.1 PostCard コンポーネント（\_presentational/PostCard.tsx）

```typescript
export function PostCard({ post }: PostCardProps) {
	return (
		<Link href={`/read-list/posts/${post.id}`}>
			<Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
						{post.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							{post.createdAt.toLocaleDateString("ja-JP")}
						</p>
						<span className="text-xs text-primary/70 group-hover:text-primary transition-colors">
							詳細を見る →
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
```

**一行ずつ解説**:

- `Link href={`/read-list/posts/${post.id}`}`: Next.js の Link コンポーネントでクライアントサイドルーティング、テンプレートリテラルで動的 URL 生成
- `group`: Tailwind の group クラスで、親要素のホバー時に子要素のスタイルを変更
- `hover:shadow-lg hover:shadow-primary/10`: ホバー時に影を大きくし、プライマリカラーの影を追加
- `transition-all duration-300`: すべてのプロパティの変化を 300ms でアニメーション
- `cursor-pointer`: マウスカーソルをポインターに変更
- `border-border/50 hover:border-primary/30`: ボーダーを薄く表示し、ホバー時にプライマリカラーに変更
- `bg-card/50 backdrop-blur-sm`: カードの背景を半透明にし、背景をぼかす
- `line-clamp-2`: テキストを 2 行で省略表示
- `group-hover:text-primary`: 親要素がホバーされた時にテキストカラーをプライマリカラーに変更
- `toLocaleDateString("ja-JP")`: 日付を日本語形式で表示
- `flex items-center justify-between`: フレックスボックスで要素を中央揃えし、両端に配置

#### 4.2 PostList コンポーネント（\_presentational/PostList.tsx）

```typescript
export function PostList({ posts }: PostListProps) {
	if (posts.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="max-w-md mx-auto">
					<div className="text-6xl mb-4">📚</div>
					<h3 className="text-xl font-semibold mb-2 text-foreground">
						読み物がありません
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						まだ読み物が追加されていません。
						<br />
						新しい記事や投稿を追加して、読み物リストを充実させましょう。
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
```

**一行ずつ解説**:

- `if (posts.length === 0)`: 投稿が 0 件の場合の処理
- `text-center py-16`: テキストを中央揃え、上下にパディング 16 を追加
- `max-w-md mx-auto`: 最大幅を md サイズに設定し、左右のマージンを自動（中央揃え）
- `text-6xl mb-4`: フォントサイズを 6xl に設定し、下のマージンを 4 に設定
- `grid gap-6`: グリッドレイアウトでアイテム間の間隔を 6 に設定
- `md:grid-cols-2`: 中サイズ以上の画面で 2 列表示
- `lg:grid-cols-3`: 大サイズ以上の画面で 3 列表示
- `posts.map((post) => (`: posts 配列をループ処理
- `key={post.id}`: React の key 属性でパフォーマンス最適化（各要素を一意に識別）

#### 4.3 PostDetail コンポーネント（\_presentational/PostDetail.tsx）

```typescript
export function PostDetail({ post }: PostDetailProps) {
	return (
		<Card className="max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
			<CardHeader className="pb-6">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-2xl">📖</span>
					<span className="text-sm text-primary font-medium">読み物詳細</span>
				</div>
				<CardTitle className="text-3xl font-bold leading-tight">
					{post.title}
				</CardTitle>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span>📅 {post.createdAt.toLocaleDateString("ja-JP")}</span>
					<span>👤 著者ID: {post.authorId}</span>
					<span>🏷️ {post.category}</span>
				</div>
			</CardHeader>
			<CardContent>
				<div className="prose prose-invert max-w-none prose-lg">
					<div className="bg-muted/30 rounded-lg p-6 border border-border/30">
						<p className="whitespace-pre-wrap leading-relaxed text-foreground">
							{post.body}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
```

**一行ずつ解説**:

- `max-w-4xl mx-auto`: 最大幅を 4xl に設定し、左右のマージンを自動（中央揃え）
- `pb-6`: 下のパディングを 6 に設定
- `flex items-center gap-2`: フレックスボックスで要素を中央揃えし、間隔を 2 に設定
- `text-3xl font-bold leading-tight`: フォントサイズ 3xl、太字、行間を狭く設定
- `prose prose-invert`: Tailwind Typography の prose クラスでリッチテキスト用のスタイル、ダークテーマ用
- `max-w-none`: 最大幅制限を解除
- `prose-lg`: 大きなフォントサイズの prose
- `bg-muted/30 rounded-lg p-6`: 背景を薄い色に設定、角を丸く、パディング 6 を追加
- `whitespace-pre-wrap`: 改行とスペースを保持
- `leading-relaxed`: 行間を広く設定

### 5. ページコンポーネント

#### 5.1 一覧ページ（page.tsx）

```typescript
export default async function PostsPage() {
	const posts = await getPostList();

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						📚 読み物リスト
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						興味深い記事や投稿をまとめて管理
						<br />
						<span className="text-sm text-muted-foreground/80">
							クリックして詳細を読むことができます
						</span>
					</p>
				</div>

				<PostList posts={posts} />
			</div>
		</div>
	);
}
```

**一行ずつ解説**:

- `export default async function`: デフォルトエクスポートの非同期関数（Server Component）
- `const posts = await getPostList()`: Repository 層でデータ取得、await で非同期処理の完了を待つ
- `min-h-screen bg-background`: 最小高さを画面サイズに設定し、背景色を設定
- `container mx-auto px-4 py-8`: コンテナ要素で最大幅を設定、左右のマージンを自動、パディングを設定
- `text-4xl font-bold mb-4`: フォントサイズ 4xl、太字、下のマージン 4
- `bg-gradient-to-r from-primary to-primary/70`: 左から右へのグラデーション、プライマリカラーから 70%透明度のプライマリカラーへ
- `bg-clip-text text-transparent`: テキストにグラデーションを適用
- `max-w-2xl mx-auto`: 最大幅を 2xl に設定し、左右のマージンを自動（中央揃え）
- `leading-relaxed`: 行間を広く設定

#### 5.2 詳細ページ（[id]/page.tsx）

```typescript
export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { id } = await params;
	const postId = parseInt(id);

	if (isNaN(postId)) {
		notFound();
	}

	const post = await getPostById(postId);

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link
						href="/read-list/posts"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 読み物リストに戻る
					</Link>
				</div>

				<PostDetail post={post} />
			</div>
		</div>
	);
}
```

**一行ずつ解説**:

- `params: Promise<{ id: string }>`: App Router の仕様で、params は非同期で取得される
- `const { id } = await params`: params から id を取得（非同期処理）
- `const postId = parseInt(id)`: 文字列の id を数値に変換
- `if (isNaN(postId))`: 数値変換に失敗した場合（無効な ID）
- `notFound()`: Next.js の notFound 関数で 404 ページを表示
- `if (!post)`: 投稿が存在しない場合
- `inline-flex items-center`: インラインフレックスボックスで要素を中央揃え
- `text-sm text-muted-foreground`: フォントサイズ小、薄い色
- `hover:text-primary transition-colors`: ホバー時にプライマリカラーに変更、色の変化をアニメーション

## データフロー

### 1. 一覧表示の流れ

1. ユーザーが `/read-list/posts` にアクセス
2. `PostsPage` コンポーネントが実行される
3. `getPostList()` 関数が呼び出される
4. Prisma でデータベースから投稿一覧を取得
5. `PostList` コンポーネントにデータが渡される
6. `PostCard` コンポーネントが各投稿に対してレンダリングされる

### 2. 詳細表示の流れ

1. ユーザーが投稿カードをクリック
2. `/read-list/posts/[id]` に遷移
3. `PostDetailPage` コンポーネントが実行される
4. URL パラメータから ID を取得
5. ID の妥当性をチェック
6. `getPostById()` 関数でデータベースから投稿詳細を取得
7. 投稿が存在しない場合は 404 ページを表示
8. `PostDetail` コンポーネントで詳細を表示

## 技術的なポイント

### 1. Server Components

- すべてのページコンポーネントは Server Component
- サーバーサイドでデータ取得とレンダリングが行われる
- クライアントサイドの JavaScript が不要でパフォーマンスが向上

### 2. 型安全性

- TypeScript で厳密な型定義
- Prisma の型生成でデータベーススキーマと同期
- コンパイル時にエラーを検出

### 3. パフォーマンス最適化

- 一覧表示では必要な列のみ取得（`PostListItem`）
- インデックスを使用した高速検索
- クライアントサイドルーティングでページ遷移が高速

### 4. ユーザビリティ

- レスポンシブデザインでモバイル対応
- ダークテーマ対応
- ホバーエフェクトとアニメーション
- 空状態の適切な表示

## まとめ

この読み物リスト機能は、Next.js 15 の App Router、Prisma、TypeScript、Tailwind CSS を使用して構築されています。各層が明確に分離されており、保守性と拡張性に優れた設計になっています。Server Components を活用することで、パフォーマンスと SEO の両方を実現しています。

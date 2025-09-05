import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { Button } from "@/components/ui/button";
// ↑ shadcn/uiのButtonコンポーネント

import { getPostList } from "./_repository/postRepository";
// ↑ Repository層の関数をインポート

import { PostList } from "./_presentational/PostList";
// ↑ Presentational層のコンポーネントをインポート

export default async function PostsPage() {
	// ↑ デフォルトエクスポートの非同期関数
	// ↑ Server Component（サーバーサイドで実行）

	const posts = await getPostList();
	// ↑ Repository層でデータ取得
	// ↑ await: 非同期処理の完了を待つ

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* ↑ コンテナ要素 */}
				{/* ↑ container: 最大幅を設定 */}
				{/* ↑ mx-auto: 左右のマージンを自動（中央揃え） */}
				{/* ↑ px-4: 左右のパディング */}
				{/* ↑ py-8: 上下のパディング */}

				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						📚 読み物リスト
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-6">
						興味深い記事や投稿をまとめて管理
						<br />
						<span className="text-sm text-muted-foreground/80">
							クリックして詳細を読むことができます
						</span>
					</p>

					{/* 新規作成ボタン */}
					<Button asChild>
						<Link href="/read-list/posts/new">📝 新しい投稿を作成</Link>
					</Button>
				</div>

				<PostList posts={posts} />
				{/* ↑ PostListコンポーネントにpostsデータを渡す */}
			</div>
		</div>
	);
}

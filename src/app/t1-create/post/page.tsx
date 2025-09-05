import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { PostForm } from "./_presentational/PostForm";
// ↑ フォームコンポーネントをインポート

export default function T1CreatePostPage() {
	// ↑ T1. Create（新規作成）ページのコンポーネント

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						📝 T1. Create（新規作成）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						新しい投稿を作成しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							フォームに記入して投稿を作成できます
						</span>
					</p>
				</div>

				{/* 戻るボタン */}
				<div className="mb-6">
					<Link
						href="/t2-read-list/posts"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 読み物リストに戻る
					</Link>
				</div>

				{/* フォーム */}
				<PostForm />
			</div>
		</div>
	);
}

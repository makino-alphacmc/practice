import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { PostForm } from "../_presentational/PostForm";
// ↑ フォームコンポーネントをインポート

export default function NewPostPage() {
	// ↑ 新規作成ページのコンポーネント

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* 戻るボタン */}
				<div className="mb-6">
					<Link
						href="/read-list/posts"
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

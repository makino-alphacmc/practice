import { notFound } from "next/navigation";
// ↑ Next.jsのnotFound関数（404ページ表示用）
import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { getPostById } from "../_repository/postRepository";
// ↑ Repository層の関数をインポート

import { PostDetail } from "../_presentational/PostDetail";
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
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* ↑ コンテナ要素（一覧ページと同じスタイル） */}

				{/* 戻るボタン */}
				<div className="mb-6">
					<Link
						href="/t2-read-list/posts"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 読み物リストに戻る
					</Link>
				</div>

				<PostDetail post={post} />
				{/* ↑ PostDetailコンポーネントにpostデータを渡す */}
			</div>
		</div>
	);
}

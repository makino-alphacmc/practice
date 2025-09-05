import { notFound } from "next/navigation";
import Link from "next/link";

import { getPostById } from "../_repository/postRepository";
import { PostDeleteDialog } from "../_presentational/PostDeleteDialog";

type PostDeletePageProps = {
	params: Promise<{ id: string }>;
};

export default async function PostDeletePage({ params }: PostDeletePageProps) {
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
				{/* ヘッダーセクション */}
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
						🗑️ T5. Delete（削除）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						投稿を削除しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							削除する前に内容を確認してください
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

				{/* 削除確認ダイアログ */}
				<PostDeleteDialog post={post} />
			</div>
		</div>
	);
}

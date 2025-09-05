import { notFound } from "next/navigation";
import Link from "next/link";

import { getPostById } from "../_repository/postRepository";
import { PostUpdateForm } from "../_presentational/PostUpdateForm";

type PostUpdatePageProps = {
	params: Promise<{ id: string }>;
};

export default async function PostUpdatePage({ params }: PostUpdatePageProps) {
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
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						✏️ T4. Update（更新）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						投稿を更新しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							フォームを編集して投稿を更新できます
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
				<PostUpdateForm post={post} />
			</div>
		</div>
	);
}

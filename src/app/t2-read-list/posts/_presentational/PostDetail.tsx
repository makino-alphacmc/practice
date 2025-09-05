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
		<Card className="max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
			{/* ↑ Cardコンポーネント */}
			{/* ↑ max-w-4xl: 最大幅を4xlに設定 */}
			{/* ↑ mx-auto: 左右のマージンを自動（中央揃え） */}
			<CardHeader className="pb-6">
				{/* ↑ カードヘッダー */}
				<div className="flex items-center gap-2 mb-2">
					<span className="text-2xl">📖</span>
					<span className="text-sm text-primary font-medium">読み物詳細</span>
				</div>
				<CardTitle className="text-3xl font-bold leading-tight">
					{post.title}
				</CardTitle>
				{/* ↑ カードタイトル、フォントサイズ3xl */}
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					{/* ↑ 段落要素、薄い色 */}
					<span>📅 {post.createdAt.toLocaleDateString("ja-JP")}</span>
					<span>👤 著者ID: {post.authorId}</span>
					<span>🏷️ {post.category}</span>
				</div>
			</CardHeader>
			<CardContent>
				{/* ↑ カードコンテンツ */}
				<div className="prose prose-invert max-w-none prose-lg">
					{/* ↑ prose: リッチテキスト用のスタイル */}
					{/* ↑ prose-invert: ダークテーマ用のprose */}
					{/* ↑ max-w-none: 最大幅制限を解除 */}
					{/* ↑ prose-lg: 大きなフォントサイズ */}
					<div className="bg-muted/30 rounded-lg p-6 border border-border/30">
						<p className="whitespace-pre-wrap leading-relaxed text-foreground">
							{/* ↑ 段落要素 */}
							{/* ↑ whitespace-pre-wrap: 改行とスペースを保持 */}
							{post.body}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

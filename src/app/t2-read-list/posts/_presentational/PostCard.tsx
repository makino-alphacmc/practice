import Link from "next/link";
// ↑ Next.jsのLinkコンポーネント（クライアントサイドルーティング）

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ↑ shadcn/uiのCardコンポーネント群

import type { PostListItem } from "../_dto/post";
// ↑ 型定義をインポート

type PostCardProps = {
	post: PostListItem; // プロパティの型定義
};

export function PostCard({ post }: PostCardProps) {
	// ↑ 関数コンポーネント、propsでpostを受け取る

	return (
		<Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
			{/* ↑ Cardコンポーネント */}
			{/* ↑ hover:shadow-lg: ホバー時に影を大きく */}
			{/* ↑ transition-shadow: 影の変化をアニメーション */}
			{/* ↑ duration-200: アニメーション時間200ms */}
			<CardHeader className="pb-3">
				{/* ↑ カードヘッダー、padding-bottomを3に設定 */}
				<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
					{/* ↑ カードタイトル */}
					{/* ↑ text-lg: フォントサイズ大 */}
					{/* ↑ line-clamp-2: 2行で省略表示 */}
					{post.title}
					{/* ↑ 投稿タイトルを表示 */}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* ↑ カードコンテンツ部分 */}
				<div className="flex items-center justify-between mb-4">
					<p className="text-sm text-muted-foreground">
						{/* ↑ 段落要素 */}
						{/* ↑ text-sm: フォントサイズ小 */}
						{/* ↑ text-muted-foreground: 薄い色（shadcn/uiのテーマ変数） */}
						{post.createdAt.toLocaleDateString("ja-JP")}
						{/* ↑ 作成日時を日本語形式で表示 */}
						{/* ↑ toLocaleDateString: ロケールに応じた日付フォーマット */}
					</p>
				</div>
				<div className="flex gap-2">
					<Button asChild size="sm" className="flex-1">
						<Link href={`/t2-read-list/posts/${post.id}`}>詳細を見る</Link>
					</Button>
					<Button asChild size="sm" variant="outline">
						<Link href={`/t4-update/post/${post.id}`}>編集</Link>
					</Button>
					<Button asChild size="sm" variant="destructive">
						<Link href={`/t5-delete/post/${post.id}`}>削除</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

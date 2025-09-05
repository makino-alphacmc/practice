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
			<div className="text-center py-16">
				{/* ↑ 中央揃え、上下にpadding 16 */}
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
			{/* ↑ グリッドレイアウト */}
			{/* ↑ gap-6: グリッドアイテム間の間隔 */}
			{/* ↑ md:grid-cols-2: 中サイズ以上で2列 */}
			{/* ↑ lg:grid-cols-3: 大サイズ以上で3列 */}
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

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
// ↑ Post型から id, title, createdAt のみを抽出

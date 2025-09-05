// 投稿データの完全な型定義
export type Post = {
	id: number; // 投稿ID（主キー）
	title: string; // 投稿タイトル
	body: string; // 投稿内容
	category: string; // カテゴリ
	authorId: number; // 作成者ID
	createdAt: Date; // 作成日時
};

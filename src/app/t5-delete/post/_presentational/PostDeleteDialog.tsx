"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { deletePostAction } from "../_action/post";
import type { Post } from "../_dto/post";
import Link from "next/link";

type PostDeleteDialogProps = {
	post: Post;
};

export function PostDeleteDialog({ post }: PostDeleteDialogProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-destructive">
					🗑️ 投稿を削除
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 削除対象の投稿情報 */}
					<div className="p-4 bg-muted/50 rounded-lg border">
						<h3 className="font-semibold mb-2">削除対象の投稿</h3>
						<div className="space-y-2 text-sm">
							<p>
								<span className="font-medium">ID:</span> {post.id}
							</p>
							<p>
								<span className="font-medium">タイトル:</span> {post.title}
							</p>
							<p>
								<span className="font-medium">カテゴリ:</span> {post.category}
							</p>
							<p>
								<span className="font-medium">作成日:</span>{" "}
								{post.createdAt.toLocaleDateString("ja-JP")}
							</p>
						</div>
					</div>

					{/* 警告メッセージ */}
					<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
						<p className="text-destructive font-medium">
							⚠️ この操作は取り消せません
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							投稿を削除すると、すべてのデータが完全に削除されます。
						</p>
					</div>

					{/* 削除ボタン */}
					<form action={deletePostAction}>
						<input type="hidden" name="id" value={post.id} />
						<Button type="submit" variant="destructive" className="w-full">
							投稿を削除する
						</Button>
					</form>

					{/* 戻るボタン */}
					<Button variant="outline" asChild className="w-full">
						<Link href="/t2-read-list/posts">キャンセル</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

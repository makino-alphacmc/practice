"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { updatePostAction } from "../_action/post";
import type { Post } from "../_dto/post";
import { PostCategory } from "@prisma/client";

type PostUpdateFormProps = {
	post: Post;
};

export function PostUpdateForm({ post }: PostUpdateFormProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">✏️ 投稿を更新</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={updatePostAction} className="space-y-6">
					{/* ID（隠しフィールド） */}
					<input type="hidden" name="id" value={post.id} />

					{/* タイトル入力 */}
					<div className="space-y-2">
						<Label htmlFor="title">タイトル *</Label>
						<Input
							id="title"
							name="title"
							placeholder="投稿のタイトルを入力してください"
							defaultValue={post.title}
							required
						/>
					</div>

					{/* カテゴリ選択 */}
					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ *</Label>
						<Select name="category" required defaultValue={post.category}>
							<SelectTrigger>
								<SelectValue placeholder="カテゴリを選択してください" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(PostCategory).map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* 著者ID入力 */}
					<div className="space-y-2">
						<Label htmlFor="authorId">著者ID *</Label>
						<Input
							id="authorId"
							name="authorId"
							type="number"
							placeholder="1"
							defaultValue={post.authorId}
							required
						/>
					</div>

					{/* 本文入力 */}
					<div className="space-y-2">
						<Label htmlFor="body">本文 *</Label>
						<Textarea
							id="body"
							name="body"
							placeholder="投稿の内容を入力してください"
							rows={8}
							defaultValue={post.body}
							required
						/>
					</div>

					{/* 送信ボタン */}
					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							投稿を更新
						</Button>
						<Button type="button" variant="outline" asChild>
							<a href="/t2-read-list/posts">キャンセル</a>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

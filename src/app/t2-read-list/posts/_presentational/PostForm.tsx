"use client";

import { useFormState } from "react-dom";
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

import { createPostAction, type ActionResult } from "../_action/post";

// フォームの初期状態
const initialState: ActionResult = {
	success: false,
};

export function PostForm() {
	// ↑ フォームコンポーネント

	const [state, formAction] = useFormState(createPostAction, initialState);
	// ↑ useFormState: サーバーアクションとフォーム状態を管理

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					📝 新しい投稿を作成
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-6">
					{/* エラーメッセージ表示 */}
					{state.error && (
						<div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{state.error}
						</div>
					)}

					{/* タイトル入力 */}
					<div className="space-y-2">
						<Label htmlFor="title">タイトル *</Label>
						<Input
							id="title"
							name="title"
							placeholder="投稿のタイトルを入力してください"
							required
						/>
						{state.fieldErrors?.title && (
							<p className="text-sm text-red-600">
								{state.fieldErrors.title[0]}
							</p>
						)}
					</div>

					{/* カテゴリ選択 */}
					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ *</Label>
						<Select name="category" required>
							<SelectTrigger>
								<SelectValue placeholder="カテゴリを選択してください" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Tech">Tech</SelectItem>
								<SelectItem value="Life">Life</SelectItem>
								<SelectItem value="General">General</SelectItem>
							</SelectContent>
						</Select>
						{state.fieldErrors?.category && (
							<p className="text-sm text-red-600">
								{state.fieldErrors.category[0]}
							</p>
						)}
					</div>

					{/* 著者ID入力 */}
					<div className="space-y-2">
						<Label htmlFor="authorId">著者ID *</Label>
						<Input
							id="authorId"
							name="authorId"
							type="number"
							placeholder="1"
							defaultValue={1}
							required
						/>
						{state.fieldErrors?.authorId && (
							<p className="text-sm text-red-600">
								{state.fieldErrors.authorId[0]}
							</p>
						)}
					</div>

					{/* 本文入力 */}
					<div className="space-y-2">
						<Label htmlFor="body">本文 *</Label>
						<Textarea
							id="body"
							name="body"
							placeholder="投稿の内容を入力してください"
							rows={8}
							required
						/>
						{state.fieldErrors?.body && (
							<p className="text-sm text-red-600">
								{state.fieldErrors.body[0]}
							</p>
						)}
					</div>

					{/* 送信ボタン */}
					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							投稿を作成
						</Button>
						<Button type="button" variant="outline" asChild>
							<a href="/read-list/posts">キャンセル</a>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

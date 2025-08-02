"use client";

import { useState } from "react";
import { Post } from "./types/post";

export default function Home() {
	// フォームの入力値を管理する状態
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	// フォーム送信時の処理
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault(); // デフォルトの送信動作を防ぐ

		// 新しい投稿オブジェクトを作成
		const newPost: Post = {
			id: Date.now(), // 現在時刻をIDとして使用
			title: title,
			content: content,
			createdAt: new Date().toISOString(),
		};

		// コンソールに投稿内容を出力
		console.log("新しい投稿:", newPost);

		// フォームをリセット
		setTitle("");
		setContent("");
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					ブログ投稿フォーム
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* タイトル入力フィールド */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							タイトル
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="投稿のタイトルを入力してください"
							required
						/>
					</div>

					{/* 本文入力フィールド */}
					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							本文
						</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={5}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="投稿の本文を入力してください"
							required
						/>
					</div>

					{/* 送信ボタン */}
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						投稿する
					</button>
				</form>

				<div className="mt-6 p-4 bg-gray-50 rounded-md">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">使い方</h2>
					<ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
						<li>タイトルと本文を入力してください</li>
						<li>「投稿する」ボタンをクリックしてください</li>
						<li>ブラウザの開発者ツール（F12）を開いてください</li>
						<li>コンソールタブで投稿内容を確認してください</li>
					</ol>
				</div>
			</div>
		</div>
	);
}

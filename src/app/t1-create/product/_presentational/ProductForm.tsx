"use client";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { createProductAction } from "../_action/product";

export function ProductForm() {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					🛍️ 新しい商品を作成
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={createProductAction} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">商品名 *</Label>
						<Input
							id="name"
							name="name"
							placeholder="商品名を入力してください"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ *</Label>
						<Select name="category" required>
							<SelectTrigger>
								<SelectValue placeholder="カテゴリを選択してください" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Electronics">Electronics</SelectItem>
								<SelectItem value="Clothing">Clothing</SelectItem>
								<SelectItem value="Books">Books</SelectItem>
								<SelectItem value="Home">Home</SelectItem>
								<SelectItem value="Sports">Sports</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="price">価格 *</Label>
						<Input
							id="price"
							name="price"
							type="number"
							step="0.01"
							placeholder="0.00"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="stock">在庫数 *</Label>
						<Input
							id="stock"
							name="stock"
							type="number"
							min="0"
							placeholder="0"
							required
						/>
					</div>
					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							登録する
						</Button>
						<Button type="button" variant="outline" asChild>
							<a href="/t2-read-list/products">キャンセル</a>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

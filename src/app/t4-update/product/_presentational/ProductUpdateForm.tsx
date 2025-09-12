"use client";
import React from "react";
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
import { updateProductAction } from "../_action/product";
import type { Product } from "../_dto/product";

type ProductUpdateFormProps = {
	product: Product;
};

export default function ProductUpdateForm({ product }: ProductUpdateFormProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">✏️ 商品を更新</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={updateProductAction} className="space-y-6">
					{/* ID（隠しフィールド） */}
					<input type="hidden" name="id" value={product.id} />

					{/* タイトル入力 */}
					<div className="space-y-2">
						<Label htmlFor="name">商品名 *</Label>
						<Input
							id="name"
							name="name"
							placeholder="商品名を入力してください"
							defaultValue={product.name}
							required
						/>
					</div>

					{/* カテゴリ選択 */}
					<div className="space-y-2">
						<Label htmlFor="category">カテゴリ *</Label>
						<Select name="category" required defaultValue={product.category}>
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

					{/* 著者ID入力 */}
					<div className="space-y-2">
						<Label htmlFor="price">価格 *</Label>
						<Input
							id="price"
							name="price"
							type="number"
							defaultValue={product.price}
							required
						/>
					</div>

					{/* 本文入力 */}
					<div className="space-y-2">
						<Label htmlFor="stock">在庫数 *</Label>
						<Input
							id="stock"
							name="stock"
							type="number"
							placeholder="在庫数を入力"
							defaultValue={product.stock}
							required
						/>
					</div>

					{/* 送信ボタン */}
					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							商品を更新
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

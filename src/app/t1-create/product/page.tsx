import Link from "next/link";

import { ProductForm } from "./_presentational/ProductForm";

export default function T1CreateProductPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						🛍️ T1. Create（新規作成）
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						新しい商品を作成しましょう
						<br />
						<span className="text-sm text-muted-foreground/80">
							フォームに記入して商品を作成できます
						</span>
					</p>
				</div>
				<div className="mb-6">
					<Link
						href="/t2-read-list/products"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← 商品リストに戻る
					</Link>
				</div>
				<ProductForm />
			</div>
		</div>
	);
}

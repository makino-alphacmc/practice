"use server";
import { updateProductSchema } from "../_schema/product";
import { updateProduct } from "../_repository/productRepository";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProductAction(formData: FormData) {
	// フォームデータをオブジェクトに変換
	const rawData = {
		id: parseInt(formData.get("id") as string),
		name: formData.get("name") as string,
		category: formData.get("category") as string,
		price: parseFloat(formData.get("price") as string),
		stock: parseInt(formData.get("stock") as string),
	};

	// バリデーション実行
	const validatedData = updateProductSchema.parse(rawData);

	// データベースを更新
	await updateProduct(validatedData);

	// キャッシュを無効化（一覧を更新）
	revalidateTag("products");

	// 一覧ページにリダイレクト
	redirect("/t2-read-list/products");
}

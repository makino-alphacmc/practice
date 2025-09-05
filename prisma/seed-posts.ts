import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Postテーブルのシードを開始します...");

	// CSVファイルのパス
	const seedDir = join(__dirname, "../public/seed");

	// Posts データのインポート
	console.log("📝 Posts データをインポート中...");
	const postsCsv = readFileSync(join(seedDir, "posts.csv"), "utf-8");
	const posts = parseCsv(postsCsv);

	for (const post of posts) {
		await prisma.post.upsert({
			where: { id: parseInt(post.id) },
			update: {},
			create: {
				id: parseInt(post.id),
				title: post.title,
				body: post.body,
				category: post.category,
				authorId: parseInt(post.author_id),
				createdAt: new Date(post.created_at),
			},
		});
	}
	console.log(`✅ ${posts.length}件のPostsデータをインポートしました`);

	console.log("🎉 Postテーブルのシードが完了しました！");
}

// CSVパーサー関数
function parseCsv(csvContent: string): any[] {
	const lines = csvContent.trim().split("\n");
	const headers = lines[0].split(",");
	const data = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(",");
		const row: any = {};

		for (let j = 0; j < headers.length; j++) {
			row[headers[j]] = values[j];
		}

		data.push(row);
	}

	return data;
}

main()
	.catch((e) => {
		console.error("❌ シード中にエラーが発生しました:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

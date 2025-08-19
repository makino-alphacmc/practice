import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 データベースのシードを開始します...");

	// CSVファイルのパス
	const seedDir = join(__dirname, "../public/seed");

	// Users データのインポート
	console.log("📝 Users データをインポート中...");
	const usersCsv = readFileSync(join(seedDir, "users.csv"), "utf-8");
	const users = parseCsv(usersCsv);

	for (const user of users) {
		await prisma.user.upsert({
			where: { id: parseInt(user.id) },
			update: {},
			create: {
				id: parseInt(user.id),
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: new Date(user.created_at),
			},
		});
	}
	console.log(`✅ ${users.length}件のUsersデータをインポートしました`);

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

	// Products データのインポート
	console.log("📝 Products データをインポート中...");
	const productsCsv = readFileSync(join(seedDir, "products.csv"), "utf-8");
	const products = parseCsv(productsCsv);

	for (const product of products) {
		await prisma.product.upsert({
			where: { id: parseInt(product.id) },
			update: {},
			create: {
				id: parseInt(product.id),
				name: product.name,
				category: product.category,
				price: parseFloat(product.price),
				stock: parseInt(product.stock),
				createdAt: new Date(product.created_at),
			},
		});
	}
	console.log(`✅ ${products.length}件のProductsデータをインポートしました`);

	// Contacts データのインポート
	console.log("📝 Contacts データをインポート中...");
	const contactsCsv = readFileSync(join(seedDir, "contacts.csv"), "utf-8");
	const contacts = parseCsv(contactsCsv);

	for (const contact of contacts) {
		await prisma.contact.upsert({
			where: { id: parseInt(contact.id) },
			update: {},
			create: {
				id: parseInt(contact.id),
				name: contact.name,
				email: contact.email,
				message: contact.message,
				createdAt: new Date(contact.created_at),
			},
		});
	}
	console.log(`✅ ${contacts.length}件のContactsデータをインポートしました`);

	console.log("🎉 すべてのデータのインポートが完了しました！");
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

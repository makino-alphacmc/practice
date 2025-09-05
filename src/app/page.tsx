import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	const practices = [
		{
			id: 1,
			title: "T1. Create（新規作成）",
			description: "Post を 1 件作成できる",
			href: "/practice/crud/create",
		},
		{
			id: 2,
			title: "T2. Read-List（一覧）",
			description: "Post 一覧と空状態を表示",
			href: "/practice/crud/read-list",
		},
		{
			id: 3,
			title: "T3. Read-Detail（詳細）",
			description: "1 件の詳細と 404 分岐",
			href: "/practice/crud/read-detail",
		},
		{
			id: 4,
			title: "T4. Update（更新）",
			description: "タイトル/本文を更新",
			href: "/practice/crud/update",
		},
		{
			id: 5,
			title: "T5. Delete（削除）",
			description: "1 件削除と確認モーダル",
			href: "/practice/crud/delete",
		},
		{
			id: 6,
			title: "T6. 検索・並び替え・ページング",
			description: "URL 同期（?q=&sort=&page=）",
			href: "/practice/search-pagination",
		},
		{
			id: 7,
			title: "T7. フォーム送信",
			description: "バリデーション付き送信",
			href: "/practice/form-submission",
		},
		{
			id: 8,
			title: "T8. 非同期バリデーション",
			description: "重複メールチェック",
			href: "/practice/async-validation",
		},
		{
			id: 9,
			title: "T9. ログイン（最小）",
			description: "サインイン & /dashboard 保護",
			href: "/practice/auth/login",
		},
		{
			id: 10,
			title: "T9-2. 認可（RBAC）",
			description: "user/admin の権限制御",
			href: "/practice/auth/rbac",
		},
		{
			id: 11,
			title: "T11. 画像アップロード",
			description: "1 枚の画像アップロード",
			href: "/practice/file-upload",
		},
		{
			id: 12,
			title: "T10. 楽観更新",
			description: "即時反映 UX",
			href: "/practice/optimistic-update",
		},
		{
			id: 13,
			title: "T12. エラー設計",
			description: "例外を UI に橋渡し",
			href: "/practice/error-handling",
		},
		{
			id: 14,
			title: "T13. セッション管理",
			description: "ユーザー状態の永続化とセキュアな管理",
			href: "/practice/session-management",
		},
		{
			id: 15,
			title: "セキュリティ",
			description: "CSRF / XSS / レートリミット / Secret 管理",
			href: "/practice/security",
		},
		{
			id: 16,
			title: "デプロイ",
			description: "Vercel / AWS / Docker / 環境変数管理",
			href: "/practice/deployment",
		},
		{
			id: 17,
			title: "監視・ログ",
			description: "Sentry, Vercel Analytics, Error Boundary",
			href: "/practice/monitoring",
		},
		{
			id: 18,
			title: "外部 API 連携",
			description: "決済(Stripe) / メール送信 / サードパーティ連携",
			href: "/practice/external-apis",
		},
	];

	return (
		<main className="min-h-screen bg-background">
			<div className="container mx-auto py-12 px-4">
				<div className="max-w-6xl mx-auto">
					{/* ヘッダーセクション - ダークテーマ最適化 */}
					<div className="mb-12 text-center">
						<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							🕒 15分タスクパック
						</h1>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
							Next.js 実務処理を「1 タスク＝ 15 分」で練習
							<br />
							<span className="text-sm text-muted-foreground/80">
								ダークテーマで目に優しい学習環境
							</span>
						</p>
					</div>

					{/* カードグリッド - ダークテーマ最適化 */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{practices.map((practice) => (
							<Card
								key={practice.id}
								className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
							>
								<CardHeader className="pb-4">
									<CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
										{practice.title}
									</CardTitle>
									<CardDescription className="text-muted-foreground leading-relaxed">
										{practice.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-0">
									<Link href={practice.href}>
										<Button
											className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
											size="sm"
											variant="outline"
										>
											ページに遷移する
										</Button>
									</Link>
								</CardContent>
							</Card>
						))}
					</div>

					{/* フッター - ダークテーマ最適化 */}
					<div className="mt-16 text-center">
						<p className="text-muted-foreground/60 text-sm">
							shadcn/ui + Tailwind CSS + ダークテーマで構築
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "React/Next.js 学習支援",
	description: "コードの構造と動作原理の理解に集中した学習環境",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body
				className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}
			>
				<div className="container mx-auto px-4 py-8 max-w-4xl">
					<header className="mb-8">
						<h1 className="text-3xl font-bold text-center text-blue-400 mb-2">
							React/Next.js 学習支援
						</h1>
						<p className="text-center text-gray-400 text-sm">
							コードの構造と動作原理の理解に集中
						</p>
					</header>

					<main className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
						{children}
					</main>

					<footer className="mt-8 text-center text-gray-500 text-sm">
						<p>小さなステップを何度も積み重ねて確実に定着させる</p>
					</footer>
				</div>
			</body>
		</html>
	);
}

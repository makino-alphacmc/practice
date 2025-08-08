import "./globals.css";

export const metadata = {
	title: "React学習アプリ",
	description: "コンポーネントとPropsの学習",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body>{children}</body>
		</html>
	);
}

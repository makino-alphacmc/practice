React/Next.js 学習支援 AI メモ（効率特化・practice フォルダ前提・15 分課題 / App Router + DB 使用）

⸻

🎯 基本設定

【技術スタック】
• React + TypeScript + Next.js 14+ (App Router のみ)
• CSS: Tailwind CSS（ユーティリティファースト）
• DB: Prisma + SQLite（ローカル開発用）
• 実行環境: Cursor（ローカル開発）
• 作業場所: practice フォルダ内

【学習方針】
• 1 課題=15 分で終わる"最小"タスク
• App Router の最新概念を必ず使用（Server Components, Server Actions, Route Handlers）
• 実際の DB 操作を前提とした実践的な学習
• スタイリングは Tailwind のユーティリティクラスで行う（原則、個別 CSS は書かない）
• UI は最小限だが、globals.css ではリセット・カラートークン・ベース層のみ定義（テーマ反映）
• 小さなステップを短時間で反復、目的重視

⸻

🖌 共通スタイル（globals.css / Tailwind）
• Tailwind を使用し、コンポーネントの className にユーティリティクラスを直接付与する
• globals.css は以下の用途に限定：
• Tailwind の base/components/utilities の読み込み
• テーマ用 CSS 変数（例: --brand, --bg, --fg）の定義
• 各課題のテーマ切替（背景色・余白スケールなど）
• 各課題の Phase 1 開始時に必ず自動作成 する
• layout.tsx で自動読み込みし、全ページ共通適用

⸻

📚 学習メソッド（3 段階・各タスク 15 分）

【Phase 1】模写で理解
• コメント付き完全コード提供
• 処理の流れ図解（引数・戻り値・状態変化）
• type 必須
• ファイルはユーザーが作成
• 各ステップで「なぜ必要か」を解説
• 写経形式
• Tailwind クラスの根拠（余白・色・配置）も短く注釈
• globals.css を課題仕様に合わせて自動生成（トークン更新のみ）
• Prisma スキーマと DB 操作の説明

【Phase 2】自力再現（ヒント誘導）
• コードは出さない
• 実装手順を 1 行ずつ提示
• 最初に完成図を図解
• 答えは言わず詳細ヒントで誘導
• ファイル名は必ず変更
• 使用すべき Tailwind ユーティリティを要点だけ提示（例：flex, gap-_, rounded-_, shadow など）
• DB 操作のヒントも提供

【Phase 3】継続練習
• 同じ構文を別テーマで再利用
• 毎回ファイル名変更
• ランダム出題で定着まで反復
• テーマ変更は Tailwind のクラス差し替えで表現
• DB スキーマの拡張も含む

⸻

📝 出力テンプレート

goal_image:
• ゴール画面の説明（例: 投稿一覧が中央に表示される）

what_you_learn:
• 学べる構文 / 概念 / 目的（例: Server Components, Server Actions / App Router / DB 表示）
• 使用する主要 Tailwind クラス（例: container, mx-auto, grid, gap-6, bg-white, shadow, rounded-xl, p-6）

file_structure:
practice/
src/app/
├── lib/
│ └── prisma.ts # Prisma クライアント（固定場所）
│
├── project/ # プロジェクトドメイン
│ ├── \_dto/
│ │ └── project.ts # プロジェクト DTO
│ ├── \_presentational/
│ │ ├── ProjectCard.tsx # プロジェクト専用カード
│ │ ├── ProjectHeader.tsx
│ │ ├── ProjectBody.tsx
│ │ └── ProjectFooter.tsx
│ ├── \_repository/
│ │ └── projectRepository.ts # プロジェクトの DB アクセス
│ ├── \_action/
│ │ └── project.ts # プロジェクト関連アクション
│ └── \_schema/
│ └── project.ts # プロジェクトバリデーションスキーマ
│
├── product/ # 商品ドメイン
│ ├── \_dto/
│ │ └── product.ts
│ ├── \_presentational/
│ │ ├── Card.tsx
│ │ ├── CardHeader.tsx
│ │ ├── CardBody.tsx
│ │ ├── CardFooter.tsx
│ │ └── ProductCard.tsx
│ ├── \_repository/
│ │ └── productRepository.ts
│ ├── \_action/
│ │ └── product.ts
│ └── \_schema/
│ └── product.ts
│
├── user/ # ユーザードメイン
│ ├── \_dto/
│ │ └── user.ts
│ ├── \_presentational/
│ │ └── UserCard.tsx
│ ├── \_repository/
│ │ └── userRepository.ts
│ ├── \_action/
│ │ └── user.ts
│ └── \_schema/
│ └── user.ts
│
├── layout.tsx
├── page.tsx
└── globals.css

Tailwind セットアップファイル（既存プロジェクトに合わせて配置）
tailwind.config.ts
postcss.config.js

db_schema:
model Post {
id Int @id @default(autoincrement())
title String
content String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

step_by_step_explanation（Phase 1）:
• 図解と最小ステップで処理の流れ説明
• 「この行は何のためか」を短く
• スタイルは Tailwind のクラスを列挙して根拠をひと言で（例：flex=横並び, gap-4=余白, rounded-lg=角丸）
• DB 操作の流れも説明

full_code_with_comment（Phase 1）:
• コメント付きの最小コードだけ
• 補助・拡張コードは別保管（必要時に提示）
• className は Tailwind のみ（必要最小限の globals.css はトークン）
• Prisma クエリと Server Components の実装

self_challenge_instruction（Phase 2）:
• 実装手順のみ（1 行ずつ）
• ファイル名は 1 回目と変更
• 使う Tailwind クラスのヒントを箇条書きで添える
• DB 操作の手順も含む

repeat_and_random_practice（Phase 3）:
• 同じ構文で別テーマ
• 毎回違うファイル名
• テーマ差分は Tailwind のクラス変更で表現
• DB スキーマの拡張も含む

⸻

🏗️ アーキテクチャ概念（ドメイン駆動設計）

【基本原則】
• ドメイン別フォルダ分割（project/, product/, user/）
• 各ドメイン内で層別フォルダ分割（\_dto/, \_presentational/, \_repository/, \_action/, \_schema/）
• lib/ は共通ライブラリ（Prisma クライアントなど）
• 関心の分離と責任の明確化

【各層の役割】
• \_dto/ - データ転送オブジェクト（型定義、API 境界）
• \_presentational/ - UI コンポーネント（表示ロジックのみ）
• \_repository/ - データアクセス（DB 操作、外部 API）
• \_action/ - ビジネスロジック（ドメインサービス、ユースケース）
• \_schema/ - バリデーション（Zod スキーマ、データ検証）

【命名規則】
• ドメイン名/ - 機能領域別フォルダ
• \_層名/ - アンダースコアプレフィックスで層を明示
• ファイル名 - 機能名 + 層名（例：productRepository.ts）

【インポートパス】
• 同ドメイン内: ../\_dto/product
• 他ドメイン: ../../user/\_dto/user
• 共通ライブラリ: ../../lib/prisma

⸻

⚠️ 実行ルール

必須: 1. 1 課題=15 分で終わるサイズに分割 2. 図解必須（テキスト図で OK） 3. App Router の最新概念を必ず使用（Server Components, Server Actions, Route Handlers） 4. 実際の DB 操作を前提とした実装 5. 不要部分はサンプル化して本文に載せない（こちらで保管） 6. Phase 2 は答え禁止（ヒントのみ） 7. 毎回ファイル名を変更 8. 各手順に"目的"を一行で明記 9. スタイルは Tailwind CSS を使用（ユーティリティファースト） 10. UI は globals.css で統一しつつ課題ごとにテーマ変数のみ変更（Phase 1 で自動作成） 11. Prisma スキーマと DB 操作の説明を含む 12. ドメイン駆動設計のフォルダ構成に従う（ドメイン別 + 層別分割） 13. 各層の責任を明確に分離（\_dto, \_presentational, \_repository, \_action, \_schema）

禁止:
• 過剰な UI/アニメーション
• 大規模な一括課題
• 不要パッケージ導入
• 個別コンポーネントでの余計なカスタム CSS（Tailwind で代替可能なもの）
• Pages Router や古い Next.js 概念の使用
• Mock データの使用（実際の DB 操作を前提）

⸻

🔄 実行例（各 15 分想定）

1 回目（P1）: 商品ドメイン - Prisma スキーマ + Server Component で商品一覧表示（product/\_presentational/ProductCard.tsx + product/\_action/product.ts / テーマはダーク可）
2 回目（P2）: ユーザードメイン - Server Action でユーザー作成フォーム（user/\_presentational/UserCard.tsx + user/\_action/user.ts / ライトテーマ）
3 回目（P3）: プロジェクトドメイン - Route Handler でプロジェクト API + プロジェクト一覧表示（project/\_presentational/ProjectCard.tsx + project/\_action/project.ts / テーマ変数変更）

⸻

🗄️ データベース概念と拡張テーブル

【基本テーブル（既存）】
• User - ユーザー情報（id, name, email, role, createdAt）
• Post - 投稿（id, title, body, category, authorId, createdAt）
• Product - 商品（id, name, category, price, stock, createdAt）
• Contact - お問い合わせ（id, name, email, message, createdAt）

【拡張テーブル（課題別追加）】

【SNS 機能系】
• Comment - コメント機能

- id, content, authorId, postId, createdAt
- User と Post との関連（1:N）

• Like - いいね機能

- id, userId, postId, createdAt
- User と Post の多対多関係

• Tag - タグ機能

- id, name, color
- PostTag 中間テーブルで Post と多対多

【管理機能系】
• Category - カテゴリ管理

- id, name, description, color
- Post と Product との関連

• Notification - 通知機能

- id, userId, type, message, isRead, createdAt
- User との関連

【ファイル管理系】
• File - ファイル管理

- id, filename, originalName, mimeType, size, path, uploadedBy, createdAt
- User との関連（アップロード者）

【拡張データ例】
• コメントデータ（Comment.csv）
• いいねデータ（Likes.csv）
• タグデータ（Tags.csv, PostTags.csv）
• 通知データ（Notifications.csv）
• ファイルデータ（Files.csv）

【課題別テーブル選択ガイド】
• 基本表示系 → User, Post, Product（既存）
• インタラクション系 → Comment, Like, Tag
• 管理系 → Category, Notification
• ファイル系 → File
• 複合機能 → 基本 + 拡張テーブル組み合わせ

# React/Next.js 学習支援 AI メモ（効率特化・practice フォルダ前提・15 分課題）

---

## 🎯 基本設定

【技術スタック】

- React + TypeScript + Next.js (App Router)
- 実行環境: Cursor（ローカル開発）
- 作業場所: practice フォルダ内

【学習方針】

- 1 課題=15 分で終わる“最小”タスク
- 余計なコードは課題本文に含めない（こちらで保管し、必要時のみ提示）
- UI は最小限だが、globals.css で課題ごとのテーマを反映
- 小さなステップを短時間で反復、目的重視

---

## 🖌 共通スタイル（globals.css）

- globals.css は**課題内容に合わせたデザインに毎回調整**する  
  （例：中央寄せ・ダークテーマ・アクセントカラーなど）
- 各課題の **Phase 1 開始時に必ず自動作成** する
- デザインは課題テーマに沿って毎回変えることで、UI/UX 表現の理解も合わせて学習する
- layout.tsx で自動読み込みし、全ページ共通適用

---

## 📚 学習メソッド（3 段階・各タスク 15 分）

【Phase 1】模写で理解

- コメント付き完全コード提供
- 処理の流れ図解（引数・戻り値・状態変化）
- type 必須
- ファイルはユーザーが作成
- 各ステップで「なぜ必要か」を解説
- 写経形式
- **globals.css を課題仕様に合わせて自動生成**

【Phase 2】自力再現（ヒント誘導）

- コードは出さない
- 実装手順を 1 行ずつ提示
- 最初に完成図を図解
- 答えは言わず詳細ヒントで誘導
- ファイル名は必ず変更

【Phase 3】継続練習

- 同じ構文を別テーマで再利用
- 毎回ファイル名変更
- ランダム出題で定着まで反復

---

## 📝 出力テンプレート

goal_image:

- ゴール画面の説明（例: 投稿一覧が中央に表示される）

what_you_learn:

- 学べる構文 / 概念 / 目的（例: useState, fetch / 非同期処理 / API 表示）

file_structure:
practice/
src/app/
layout.tsx
page.tsx
globals.css # 各課題のテーマデザインを反映（Phase 1 で自動作成）
types/post.ts
components/PostCard.tsx

mock_data:
const mockPosts = [
{ id: 1, title: "投稿 1", createdAt: "2024-01-01" },
{ id: 2, title: "投稿 2", createdAt: "2024-01-02" }
];

step_by_step_explanation（Phase 1）:

- 図解と最小ステップで処理の流れ説明
- 「この行は何のためか」を短く

full_code_with_comment（Phase 1）:

- コメント付きの最小コードだけ
- 補助・拡張コードは別保管（必要時に提示）

self_challenge_instruction（Phase 2）:

- 実装手順のみ（1 行ずつ）
- ファイル名は 1 回目と変更

repeat_and_random_practice（Phase 3）:

- 同じ構文で別テーマ
- 毎回違うファイル名

---

## ⚠️ 実行ルール

必須:

1. 1 課題=15 分で終わるサイズに分割
2. 図解必須（テキスト図で OK）
3. 仮データはコピペ可能
4. 不要部分はサンプル化して本文に載せない（こちらで保管）
5. Phase 2 は答え禁止（ヒントのみ）
6. 毎回ファイル名を変更
7. 各手順に“目的”を一行で明記
8. UI は **globals.css** で統一しつつ課題ごとに変更（Phase 1 で自動作成）

禁止:

- 過剰な UI/アニメーション
- 大規模な一括課題
- 不要パッケージ導入

---

## 🔄 実行例（各 15 分想定）

1 回目（P1）: types/post.ts + PostCard で投稿 2 件を中央カード表示（globals.css はダークテーマ＋中央寄せ）  
2 回目（P2）: types/user.ts でユーザー 2 件を一覧表示（globals.css はライトテーマ＋テーブル表示向け）  
3 回目（P3）: types/product.ts で商品 2 件をカード表示（globals.css は商品一覧用の配色に変更）

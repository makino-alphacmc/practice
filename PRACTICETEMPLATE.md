## 🎯 基本設定

【技術スタック】

- React + TypeScript + Next.js (App Router)
- 実行環境: Cursor（ローカル開発）
- 作業場所: practice フォルダ内

【学習方針】

- UI は最小限、構造と動作原理を理解
- 小さなステップを短時間で反復
- コードは最小限・目的重視

---

## 📚 学習メソッド（3 段階）

【Phase 1】模写で理解

- コメント付き完全コード提供
- 処理の流れ図解（引数・戻り値・状態変化）
- type 必須
- ファイルはユーザーが作成
- 各ステップで「なぜ必要か」を解説
- 写経形式

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

- ゴール画面の説明（例: 投稿一覧が表示される）

what_you_learn:

- 学べる構文
- 学べる概念
- 学習目的

file_structure:
practice/
src/app/
layout.tsx
page.tsx
types/post.ts
components/PostCard.tsx

mock_data:
const mockPosts = [
{ id: 1, title: "投稿 1", createdAt: "2024-01-01" },
{ id: 2, title: "投稿 2", createdAt: "2024-01-02" }
];

step_by_step_explanation（Phase 1）:

- 処理の流れ（図解あり）
- 状態の変化と UI 更新の関係

full_code_with_comment（Phase 1）:

- コメント付きコード全体

self_challenge_instruction（Phase 2）:

- 実装手順のみ
- ファイル名は 1 回目と変更

repeat_and_random_practice（Phase 3）:

- 別テーマで同じ構文
- 毎回違うファイル名

---

## ⚠️ 実行ルール

必須:

1. 図解必須
2. 仮データはコピー可能形式
3. 不要部分はサンプルで補完
4. Phase 2 は答え禁止
5. ファイル名は毎回変更
6. 手順ごとに目的解説
7. Phase 1 はコード提供＋写経形式

禁止:

1. UI に時間をかける
2. 大規模課題
3. 複雑なパッケージ導入

---

## 🔄 実行例

1 回目（Phase 1）: types/post.ts で投稿一覧  
2 回目（Phase 2）: types/user.ts でユーザー一覧  
3 回目（Phase 3）: types/product.ts で商品一覧

---

## 🛠 Phase 1 作成ファイル

- practice/src/app/types/post.ts
- practice/src/app/components/PostCard.tsx
- practice/src/app/page.tsx（既存上書き）

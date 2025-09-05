## 🕒 15 分タスクパック（優先度付きスライス練習）

> Next.js 実務処理を「1 タスク＝ 15 分」で練習できるよう分割。  
> 各タスクは **目的 / 触る場所 / 手順（例） / DoD** で構成。  
> **手順は例に過ぎない**ので、実演ではランダムに内容を変えて出題すること。

---

### 優先度 1: CRUD 基本



#### T2. Read-List（一覧）

- **目的**: Post 一覧と空状態を表示
- **触る場所**: `_repository/postRepository.ts`, `_presentational/PostList.tsx`, `app/posts/page.tsx`
- **手順（例）**: Repository.list → RSC で呼び出し → map でレンダリング
- **DoD**: 0 件で空表示、id を key に利用

#### T3. Read-Detail（詳細）

- **目的**: 1 件の詳細と 404 分岐
- **触る場所**: `_repository/postRepository.ts`, `app/posts/[id]/page.tsx`, `_presentational/PostDetail.tsx`
- **手順（例）**: getById → notFound() 分岐
- **DoD**: 不正 ID で 404、必要最小データのみ取得

#### T4. Update（更新）

- **目的**: タイトル/本文を更新
- **触る場所**: `_schema/post.ts`, `_action/post.ts`, `_repository/postRepository.ts`, `_presentational/PostForm.tsx`
- **手順（例）**: 部分スキーマ → Action `$transaction` → revalidateTag
- **DoD**: 未変更 submit は差分なし、競合時に通知

#### T5. Delete（削除）

- **目的**: 1 件削除と確認モーダル
- **触る場所**: `_action/post.ts`, `_repository/postRepository.ts`, `_presentational/DeleteButton.tsx`
- **手順（例）**: Confirm モーダル → Action remove → revalidateTag
- **DoD**: 削除後に一覧から消える、Undo 表示（任意）

---

### 優先度 2: 検索・ページング

#### T6. 検索・並び替え・ページング

- **目的**: URL 同期（`?q=&sort=&page=`）
- **触る場所**: `_repository/postRepository.ts`, `app/posts/page.tsx`, `_presentational/PostListHeader.tsx`
- **手順（例）**: searchParams 正規化 → list に適用 → ページネーション UI
- **DoD**: URL 直叩きで同結果、検索列にインデックス設計

---

### 優先度 3: フォーム送信 + バリデーション

#### T7. フォーム送信

- **目的**: バリデーション付き送信
- **触る場所**: `_schema/contact.ts`, `_dto/contact.ts`, `_action/contact.ts`, `_presentational/ContactForm.tsx`
- **手順（例）**: zod + DTO → RHF → Action 保存 & redirect
- **DoD**: 二重送信防止、エラーは UI 表示

#### T8. 非同期バリデーション

- **目的**: 重複メールチェック
- **触る場所**: `_action/user.ts`, `_repository/userRepository.ts`, `_presentational/SignupForm.tsx`
- **手順（例）**: checkEmailExists Action → onBlur 呼び出し → setError
- **DoD**: 重複でエラー、無駄呼び出しなし

---

### 優先度 4: ログイン・認証

#### T9. ログイン（最小）

- **目的**: サインイン & `/dashboard` 保護
- **触る場所**: `auth.config`, `middleware.ts`, `_presentational/LoginForm.tsx`
- **手順（例）**: Credentials Provider 設定 → Middleware で未認証は `/login`
- **DoD**: 正常/異常分岐が動作

#### T9-2. 認可（RBAC）

- **目的**: user/admin の権限制御
- **触る場所**: `middleware.ts`, `_repository/userRepository.ts`
- **手順（例）**: user.role 判定 → admin ページのみ許可
- **DoD**: 非管理者はアクセス拒否

---

### 優先度 5: ファイルアップロード

#### T11. 画像アップロード

- **目的**: 1 枚の画像アップロード
- **触る場所**: `_action/upload.ts`, `_presentational/AvatarUploader.tsx`, `_repository/userRepository.ts`
- **手順（例）**: MIME/サイズ検証 → Action 保存 → DB へパス保存
- **DoD**: 危険拡張子除外、プレビュー表示

---

### 優先度 6: 非同期 UX

#### T10. 楽観更新

- **目的**: 即時反映 UX
- **触る場所**: `_action/like.ts`, `_repository/likeRepository.ts`, `_presentational/LikeButton.tsx`
- **手順（例）**: useOptimistic → Action 実行 → 失敗時ロールバック
- **DoD**: 遅延でも即時反映、失敗で戻る

---

### 優先度 7: エラー設計

#### T12. エラー設計

- **目的**: 例外を UI に橋渡し
- **触る場所**: `lib/errors.ts`, `_action/*`, `_presentational/*`
- **手順（例）**: Error クラス定義 → Action で捕捉し UI に変換
- **DoD**: 未捕捉は Sentry、競合エラーに専用文言

---

### 優先度 8: セッション管理

#### T13. セッション管理

- **目的**: ユーザー状態の永続化とセキュアな管理
- **触る場所**: `lib/session.ts`, `middleware.ts`, `_action/auth.ts`, `_repository/sessionRepository.ts`
- **手順（例）**: セッション作成 → 暗号化保存 → 期限管理 → 自動削除
- **DoD**: セッション期限切れで自動ログアウト、セキュアな暗号化
- **例**:
  - NextAuth.js (Auth.js)
  - iron-session
  - express-session
  - Redis セッションストア
  - JWT + httpOnly cookie
  - session storage
  - localStorage
  - cookie-based sessions
  - database sessions
  - memory sessions

### 優先度 9: 実務必須だが補助的

- **セキュリティ**: CSRF / XSS / レートリミット / Secret 管理
- **デプロイ**: Vercel / AWS / Docker / 環境変数管理
- **監視・ログ**: Sentry, Vercel Analytics, Error Boundary
- **外部 API 連携**: 決済(Stripe) / メール送信 / サードパーティ連携

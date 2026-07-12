# 研修カレンダー

医療従事者（診療放射線技師・看護師・薬剤師・臨床検査技師など）向けに、分散しがちな勉強会・研修情報を月間カレンダーで一元管理するWebアプリです。研修の登録、申込期限の管理、お気に入り・参加予定、参加後の学習メモ、参加履歴の振り返りまでを1つの画面で完結できます。

> 詳細な要件は [`requirements.md`](./requirements.md) を参照してください。

## 公開URL

https://kensyu-calendar.vercel.app

## スクリーンショット

<!-- TODO: 主要画面（カレンダー・研修詳細）のスクリーンショットを追加 -->

## 誰のためのアプリか

院外研修・学会・メーカー勉強会の情報を、ラジくる・学会サイト・職能団体・地域の研究会など複数の媒体から集めて管理している個人の医療従事者を対象にしています。「申込期限を忘れる」「同じ月の研修を比較しづらい」「受講後の記録が分散する」という課題を、研修カレンダーを中心とした一元管理で解決します。

## 主な機能（MVP）

- メール・パスワードによるユーザー登録／ログイン（Supabase Auth、RLSで本人データのみアクセス可能）
- 月間研修カレンダー（前月・次月・当月切り替え、日付・研修名から詳細表示）
- 研修情報の手動登録・編集・削除
- 分野・開催形式によるカレンダーの絞り込み
- 申込期限・申込状態（未申込／申込済み／申込不要）の管理
- お気に入り・参加予定（予定／参加済み／欠席）の管理
- 受講メモ（要点・学び・業務への活用・資料URL）の記録
- 参加履歴の年度・分野別の振り返り
- マイページ（職種・専門分野・地域の設定）

## 技術スタック

- [Next.js 16](https://nextjs.org/)（App Router, TypeScript, Server Components / Server Actions）
- [Supabase](https://supabase.com/)（Postgres, Auth, Row Level Security）
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)（`@base-ui/react`ベース）
- [date-fns](https://date-fns.org/)（カレンダーの日付計算）
- [Vercel](https://vercel.com/)（ホスティング）

## セットアップ

```bash
npm install
cp .env.local.example .env.local
# .env.local に Supabase の URL / anon key を設定
npm run dev
```

Supabaseプロジェクトを新規に用意する場合は、`supabase/migrations/0001_init.sql` をSQL Editorで実行してテーブル（`trainings`, `profiles`）とRLSポリシーを作成してください。

### 主なコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint
```

## ディレクトリ構成（抜粋）

```
src/
├── app/
│   ├── (auth)/        # ログイン・サインアップ
│   └── (app)/          # 認証後の画面（カレンダー・研修詳細・参加予定・学習記録・マイページ）
├── components/          # UIコンポーネント（shadcn/ui + 独自コンポーネント）
└── lib/
    ├── actions/         # Server Actions（trainings, auth, profile）
    └── supabase/        # Supabase クライアント（server/client）とセッション管理
supabase/migrations/      # DBスキーマ（SQL）
requirements.md            # 要件定義書
```

## このプロジェクトについて

Claude CodeのPlan Mode（設計→承認→実装）とCLAUDE.mdによるプロジェクトルールに沿って、要件定義書をもとに1機能ずつ実装・動作確認・コミットのサイクルで構築しました。開発の背景や使ったClaude Code機能、つまずいたポイントは記事にまとめています。

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

医療従事者（診療放射線技師・看護師・薬剤師・臨床検査技師など）向けの、勉強会・研修情報を月間カレンダーで一元管理するWebアプリ（「研修カレンダー」）。分散しがちな研修情報・申込期限・参加予定・受講履歴・学習メモを1箇所に集約することが目的。詳細は `requirements.md` を参照。

## 要件の正（source of truth）

`requirements.md` がこのプロジェクトの唯一の要件定義書。実装・設計判断で迷った場合は必ずこれを確認する。要件定義書にない仕様を独自に推測しない。判断が必要な場合はユーザーに確認するか、「5. 非機能要件」「6. 制約条件」に沿った妥当なデフォルトを選ぶ。

機能の優先順位は `requirements.md` 4章の Phase 列（MVP → v1.0 → v2.0）に従う。MVP（F-001〜F-015）から着手し、v1.0以降（外部サイト取り込み、通知、証明書管理など）には手を出さない。

## 技術構成（6章 制約条件より）

Next.js（TypeScript、App Router）＋ Supabase（認証・DB、Row Level Securityでユーザーごとにデータ分離）＋ Vercel（ホスティング）。予算はVercel・Supabaseの無料枠を基本とする。AI機能・外部サイト自動取得はMVPでは実装しない（v2.0以降）。

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # ビルド済みアプリの起動
npm run lint     # ESLint
```

テストランナーは未導入。テストを追加する場合はこのセクションに実行コマンドを追記すること。

## コーディング規約

- パスエイリアスは `@/*` → `src/*`。
- App Router構成（`src/app/`）。Server ComponentsとServer Actionsを優先し、クライアント側の状態管理は必要な箇所に限定する。
- Supabaseクライアントはサーバー用・ブラウザ用を分離する（`src/lib/supabase/server.ts` / `client.ts` の構成を想定）。
- 研修の状態（未申込・申込済み・参加予定・参加済み・欠席）や分野・開催形式などの区分値は、要件定義書10章のデータ要件に準拠したenum/型として一箇所で管理する。

## 実装の進め方

- 複数ファイルにまたがる実装は、いきなり書き始めずPlan Modeで設計案を提示し、承認を得てから実装する。
- 1機能ずつ「実装 → 動作確認 → コミット」の小さいサイクルで進める。一度に複数機能をまとめて実装しない。
- 画面構成・ナビゲーション構造は `requirements.md` 7〜8章の画面遷移・サイトマップに従う（最大3層、主要機能は2クリック以内）。
- 患者情報・診療情報を保存する機能、医療判断を行う機能は実装しない（1.3 スコープ「含まないもの」参照）。

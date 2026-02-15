# プロジェクト概要

ポモドーロタイマーとYouTube音楽再生を組み合わせたNext.jsベースのWebアプリケーション。Work / Short Break / Long Break の3デッキにそれぞれYouTube URLを割り当て、タイマーの切り替わりに合わせてトラックを自動で切り替える。

# 主要機能

- **3デッキ構成**: Work / Short Break / Long Break の各デッキに時間（スライダー）とYouTube URLの入力フィールドを配置
- **タイマー**: 各セッションの時間を自由に設定可能。`Date.now()`ベースでバックグラウンドタブでも正確に動作
- **自動切替 & ループ**: トラックがタイマーより短い場合はループ再生。セッション終了時に自動フェードアウト（最後5秒）して次デッキへ遷移
- **サイクル設定**: 作業/休憩のサイクル数、Long Break の挿入間隔を設定可能
- **ローカル永続化**: URL・時間・テーマ設定を localStorage に保存（DB不使用）
- **一時停止**: タイマー一時停止時は音楽も同時に停止
- **セッション完了**: 全サイクル終了後は自動停止
- **ダーク/ライトモード**: CSS変数ベースのテーマシステム。デフォルトはダーク
- **エラー通知**: 無効なURLや埋め込み不可の動画の場合、モーダルで通知

# 技術スタック

- **フレームワーク**: Next.js 16（App Router）
- **パッケージマネージャ**: pnpm
- **スタイリング**: Tailwind CSS v4（CSS変数 + `@theme inline`）
- **アニメーション**: Framer Motion（`motion/react`）
- **フォント**: Inter（UI） + Geist Mono（タイマー・数値）、`next/font/google` で読み込み
- **API**: YouTube IFrame Player API
- **永続化**: localStorage（`useLocalStorage` フック）
- **デプロイ**: Vercel

# プロジェクト構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト（フォント、テーマ初期化）
│   ├── page.tsx            # メインページ（3デッキ + タイマー + コントロール）
│   └── globals.css         # CSS変数テーマ、Tailwind設定
├── components/
│   ├── Button.tsx          # 共通ボタン（primary / secondary バリアント）
│   ├── ControlBar.tsx      # Start / Pause / Resume / Reset ボタン群
│   ├── CycleSettings.tsx   # サイクル数・Long Break間隔の設定
│   ├── DeckPanel.tsx       # 各デッキのパネル（時間スライダー + URL入力 + YouTube埋め込み）
│   ├── ErrorModal.tsx      # エラーモーダル
│   ├── SessionIndicator.tsx # 現在のセッション状態表示
│   ├── ThemeScript.tsx     # FOUC防止用インラインスクリプト
│   ├── ThemeToggle.tsx     # ダーク/ライト切替ボタン
│   ├── TimerDisplay.tsx    # タイマーカウントダウン表示
│   ├── UrlInput.tsx        # YouTube URL入力フィールド
│   └── YouTubeEmbed.tsx    # YouTube IFrame Player コンテナ
├── hooks/
│   ├── useDualDeckController.ts  # 3デッキの再生制御（フェード、ループ、切替）
│   ├── useLocalStorage.ts        # localStorage永続化フック
│   ├── useTimer.ts               # タイマーロジック（セッション管理、サイクル制御）
│   ├── useYouTubeApi.ts          # YouTube IFrame API のスクリプト読み込み
│   └── useYouTubePlayer.ts       # 個別YouTube Playerの制御
├── lib/
│   └── youtube.ts          # YouTube URL解析ユーティリティ
└── types/
    ├── timer.ts            # SessionType, TimerStatus 等の型定義
    └── youtube.d.ts        # YouTube IFrame API のグローバル型定義
```

# 実装上の制約

- **自動再生制限**: ブラウザポリシーにより、最初のユーザー操作（Startボタン）時にプレーヤーを初期化する必要がある
- **YouTube表示要件**: 利用規約に準拠するため、プレーヤーを小さくても画面上に表示し続ける（`w-40 h-24`）
- **レスポンシブ**: デスクトップ使用を想定。`md`（768px）をブレークポイントとして1カラム↔3カラムを切り替え

# ブランドガイドライン

UIデザインの詳細は [docs/BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) を参照。

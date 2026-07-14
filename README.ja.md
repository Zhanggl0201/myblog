# 金字招牌

> 個人ブログ · [Astro](https://astro.build) + [Svelte](https://svelte.dev) + [Tailwind CSS](https://tailwindcss.com) で構築、テーマは [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) をベースにしています。

[![Node.js >= 22.12](https://img.shields.io/badge/node.js-%3E%3D22.12-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.1.2-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌐 **公開サイト:** https://blog.radarweb.top/
📦 **リポジトリ:** https://github.com/Zhanggl0201/myblog

🌏 **README の言語:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**中文繁体**](./README.tw.md) /

![Preview](./README.webp)

## ✨ 機能

### 🎨 デザインとインターフェース
- [x] [Astro](https://astro.build) と [Tailwind CSS](https://tailwindcss.com) で構築
- [x] [Swup](https://swup.js.org/) によるスムーズなアニメーションとページ遷移
- [x] システム設定検出機能付きのライト/ダークテーマ切り替え
- [x] カスタマイズ可能なテーマカラーと動的バナーカルーセル
- [x] カルーセル、透明度、ぼかし効果を備えた全画面背景画像
- [x] すべてのデバイスに対応した完全レスポンシブデザイン
- [x] JetBrains Mono フォントによる美しいタイポグラフィ

### 🔍 コンテンツと検索
- [x] [Pagefind](https://pagefind.app/) ベースの全文検索機能
- [x] 構文強調表示付きの[拡張 Markdown 機能](#-markdown拡張機能)
- [x] 自動スクロール機能付きのインタラクティブな目次
- [x] RSS フィード生成
- [x] 読書時間の推定
- [x] 記事のカテゴリ化とタグシステム

### 📱 特別ページ
- [x] **アニメトラッキングページ** - アニメの視聴進捗と評価を追跡
- [x] **友達ページ** - 友達のウェブサイトを美しいカードで紹介
- [x] **日記ページ** - ソーシャルメディアのような生活の瞬間を共有
- [x] **アーカイブページ** - 記事の整理されたタイムラインビュー
- [x] **アバウトページ** - カスタマイズ可能な自己紹介

### 🛠 技術的特徴
- [x] [Expressive Code](https://expressive-code.com/) ベースの**拡張コードブロック**
- [x] KaTeX レンダリングによる**数式サポート**
- [x] PhotoSwipe ギャラリー統合による**画像最適化**
- [x] サイトマップとメタタグを含む**SEO 最適化**
- [x] 遅延読み込みとフォントサブセット化による**パフォーマンス最適化**
- [x] Twikoo 統合による**コメントシステム**

## 🚀 クイックスタート

### 📋 動作環境
- **Node.js >= 22.12**
- **pnpm >= 9**

### 📦 ローカルで実行

```bash
# リポジトリをクローン
git clone https://github.com/Zhanggl0201/myblog.git
cd myblog

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

ブログは `http://localhost:4321` で利用可能になります。

### 📝 コンテンツ管理

- **新しい投稿を作成：** `pnpm new-post <ファイル名>`
- **投稿を編集：** `src/content/posts/` 内のファイルを修正
- **特別ページをカスタマイズ：** `src/content/spec/` 内のファイルを編集
- **画像を追加：** 画像を `public/` または `src/assets/` に配置

> このプロジェクトは**単一リポジトリモード**で運用されています——コンテンツはコードと一緒に管理されます。`ENABLE_CONTENT_SYNC=false`（コンテンツ分離は無効）です。

## ⚙️ 設定

`src/config.ts` を編集して、サイト情報、テーマカラー、バナー画像、ソーシャルリンク、および特別ページの機能切り替えをカスタマイズできます。

デプロイ前に、`src/config.ts` の `siteURL` をご自身のドメインに更新してください。

## 🚀 デプロイ（GitHub Pages）

このプロジェクトには GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）が同梱されています：

- `main` ブランチへプッシュすると、自動的にビルドされ GitHub Pages へデプロイされます。
- ビルドは `ENABLE_CONTENT_SYNC=false`（単一リポジトリモード）で実行されます。
- デプロイ前に、`src/config.ts` の `siteURL` が `https://blog.radarweb.top/` に設定されていることを確認してください。

Vercel、Netlify、Cloudflare Pages などの任意の静的ホスティングにもデプロイ可能です。

## 📝 投稿フロントマター形式

```yaml
---
title: 私の最初のブログ投稿
published: 2023-09-09
description: これは私の新しいブログの最初の投稿です。
image: ./cover.jpg
tags: [タグ1, タグ2]
category: フロントエンド
draft: false
pinned: false
comment: true
lang: ja      # 記事の言語が config.ts のサイト言語と異なる場合のみ設定
---
```

### フロントマターフィールドの説明

- **title**: 記事のタイトル（必須）
- **published**: 公開日（必須）
- **description**: SEO とプレビュー用の記事の説明
- **image**: カバー画像のパス（記事ファイルからの相対パス）
- **tags**: カテゴリ化のためのタグの配列
- **category**: 記事のカテゴリ
- **draft**: 本番環境で記事を非表示にするには `true` に設定
- **pinned**: 記事を上部に固定するには `true` に設定
- **comment**: 記事のコメントエリアを有効にするには `true` に設定（グローバルコメント機能を有効にする必要があります）
- **lang**: 記事の言語（サイトのデフォルト言語と異なる場合のみ設定）

### ピン留め記事機能

`pinned` フィールドを使用すると、重要な記事をブログリストの上部に固定できます。ピン留めされた記事は、公開日に関係なく、常に通常の記事の前に表示されます。

```yaml
pinned: true  # この記事を上部に固定
pinned: false # 通常の記事（デフォルト）
```

**ソートルール：**
1. ピン留め記事が最初に表示され、公開日でソート（最新が先）
2. 通常の記事がその後に表示され、公開日でソート（最新が先）

### 記事レベルのコメント制御

`comment` フィールドを使用すると、各記事のコメントエリアの有効化と無効化を個別に制御できます。

```yaml
comment: true  # コメントを有効にする（デフォルト）
comment: false # コメントを無効にする
```

**注意：**
この機能を使用するには、まず `src/config.ts` でコメントシステムを有効にする必要があります。

## 🧩 Markdown 拡張機能

このブログは、標準の GitHub Flavored Markdown を超える拡張機能をサポートしています：

### 📝 拡張ライティング
- **コールアウト：** `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` などを使用して美しい注釈ボックスを作成
- **数式：** `$インライン$` と `$$ブロック$$` 構文を使用して LaTeX 数式を記述
- **コード強調表示：** 行番号とコピーボタン付きの高度な構文強調表示
- **GitHub カード：** `::github{repo="ユーザー/リポジトリ"}` を使用してリポジトリカードを埋め込み

### 🎨 ビジュアル要素
- **画像ギャラリー：** 画像表示のための自動 PhotoSwipe 統合
- **折りたたみセクション：** 展開可能なコンテンツブロックを作成
- **カスタムコンポーネント：** 特別なディレクティブでコンテンツを強化

### 📊 コンテンツ整理
- **目次：** 見出しから自動生成され、スムーズスクロールをサポート
- **読書時間：** 自動計算して表示
- **記事メタデータ：** カテゴリとタグを含む豊富なフロントマターサポート

## ⚡ コマンド

すべてのコマンドはプロジェクトルートから実行します：

| コマンド                    | アクション                                  |
|:---------------------------|:------------------------------------------|
| `pnpm install`             | 依存関係をインストール                     |
| `pnpm dev`                 | `localhost:4321` でローカル開発サーバーを起動 |
| `pnpm build`               | 本番サイトを `./dist/` にビルド（Pagefind インデックスとフォント圧縮付き） |
| `pnpm preview`             | デプロイ前にビルドをローカルでプレビュー     |
| `pnpm check`               | Astro エラーチェックを実行                  |
| `pnpm format`              | Prettier でコードをフォーマット              |
| `pnpm lint`                | コードの問題をチェックして修正              |
| `pnpm new-post <ファイル名>` | 新しいブログ投稿を作成                     |
| `pnpm astro ...`           | Astro CLI コマンドを実行                   |

## 📄 ライセンス

このプロジェクトは Apache ライセンス 2.0 の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルをご覧ください。

### 元のプロジェクトライセンス

このプロジェクトは [Fuwari](https://github.com/saicaca/fuwari) をベースに開発され、元のプロジェクトは MIT ライセンスを使用しています。MIT ライセンスの要件に従い、元の著作権表示と許可通知は LICENSE.MIT ファイルに含まれています。

## 🙏 謝辞

- テーマは [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)（by matsuzaka-yuki）をベースにしています
- 元の [Fuwari](https://github.com/saicaca/fuwari) テンプレートをベースにしています
- [Yukina](https://github.com/WhitePaper233/yukina)、[Firefly](https://github.com/CuteLeaf/Firefly)、[Twilight](https://github.com/spr-aachen/Twilight) テンプレートからインスピレーションを得ています
- かわいい Live2D 看板娘プラグインに [Pio](https://github.com/Dreamer-Paul/Pio) を使用
- [Astro](https://astro.build) と [Tailwind CSS](https://tailwindcss.com) で構築
- アイコンは [Iconify](https://iconify.design/) から

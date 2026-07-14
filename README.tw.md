# 金字招牌

> 個人部落格 · 基於 [Astro](https://astro.build) + [Svelte](https://svelte.dev) + [Tailwind CSS](https://tailwindcss.com) 構建，主題基於 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)。

[![Node.js >= 22.12](https://img.shields.io/badge/node.js-%3E%3D22.12-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.1.2-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌐 **線上地址：** https://blog.radarweb.top/
📦 **倉庫地址：** https://github.com/Zhanggl0201/myblog

🌏 **README 語言：**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**中文繁體**](./README.tw.md) /

![Preview](./README.webp)

## ✨ 功能特性

### 🎨 設計與界面
- [x] 基於 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- [x] 使用 [Swup](https://swup.js.org/) 實現流暢的動畫和頁面過渡
- [x] 明暗主題切換，支援系統偏好檢測
- [x] 可自定義主題色彩和動態橫幅輪播
- [x] 全屏背景圖片，支援輪播、透明度和模糊效果
- [x] 全裝置響應式設計
- [x] 使用 JetBrains Mono 字體的優美排版

### 🔍 內容與搜尋
- [x] 基於 [Pagefind](https://pagefind.app/) 的全文搜尋功能
- [x] [增強的 Markdown 功能](#-markdown-擴展語法)，支援語法高亮
- [x] 互動式目錄，支援自動滾動
- [x] RSS 訂閱生成
- [x] 閱讀時間估算
- [x] 文章分類和標籤系統

### 📱 特色頁面
- [x] **追番頁面** - 追蹤動畫觀看進度和評分
- [x] **友鏈頁面** - 精美卡片展示朋友網站
- [x] **日記頁面** - 分享生活瞬間，類似社交媒體
- [x] **歸檔頁面** - 有序的文章時間線視圖
- [x] **關於頁面** - 可自定義的個人介紹

### 🛠 技術特性
- [x] **增強程式碼區塊**，基於 [Expressive Code](https://expressive-code.com/)
- [x] **數學公式支援**，KaTeX 渲染
- [x] **圖片最佳化**，PhotoSwipe 畫廊整合
- [x] **SEO 最佳化**，包含網站地圖和元標籤
- [x] **效能最佳化**，懶加載和字體子集化
- [x] **評論系統**，支援 Twikoo 整合

## 🚀 快速開始

### 📋 環境要求
- **Node.js >= 22.12**
- **pnpm >= 9**

### 📦 本地運行

```bash
# 克隆倉庫
git clone https://github.com/Zhanggl0201/myblog.git
cd myblog

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

部落格將在 `http://localhost:4321` 可用。

### 📝 內容管理

- **創建新文章：** `pnpm new-post <檔案名>`
- **編輯文章：** 修改 `src/content/posts/` 中的檔案
- **自定義頁面：** 編輯 `src/content/spec/` 中的特殊頁面
- **添加圖片：** 將圖片放在 `public/` 或 `src/assets/` 中

> 本專案為**單倉庫模式**——內容與程式碼一起管理，`ENABLE_CONTENT_SYNC=false`（內容分離已停用）。

## ⚙️ 配置

編輯 `src/config.ts` 自定義站點資訊、主題色彩、橫幅圖片、社交連結以及特色頁面開關。

部署前，請在該檔案中將 `siteURL` 更新為你的網域。

## 🚀 部署（GitHub Pages）

本專案已內建 GitHub Actions 工作流（`.github/workflows/deploy.yml`）：

- 推送 `main` 分支即自動構建並部署到 GitHub Pages
- 構建時使用 `ENABLE_CONTENT_SYNC=false`（單倉庫模式）
- 部署前請確認 `src/config.ts` 中的 `siteURL` 已設定為 `https://blog.radarweb.top/`

也可部署到 Vercel、Netlify、Cloudflare Pages 等任意靜態託管平台。

## 📝 文章前言格式

```yaml
---
title: 我的第一篇部落格文章
published: 2023-09-09
description: 這是我新部落格的第一篇文章。
image: ./cover.jpg
tags: [標籤1, 標籤2]
category: 前端
draft: false
pinned: false
comment: true
lang: zh-TW      # 僅當文章語言與 config.ts 中的站點語言不同時設定
---
```

### Frontmatter 欄位說明

- **title**: 文章標題（必需）
- **published**: 發布日期（必需）
- **description**: 文章描述，用於 SEO 和預覽
- **image**: 封面圖片路徑（相對於文章檔案）
- **tags**: 標籤陣列，用於分類
- **category**: 文章分類
- **draft**: 設定為 `true` 在生產環境中隱藏文章
- **pinned**: 設定為 `true` 將文章置頂
- **comment**: 設定為 `true` 啟用文章評論區（需全域啟用評論功能）
- **lang**: 文章語言（僅當與站點預設語言不同時設定）

### 置頂文章功能

`pinned` 欄位允許您將重要文章置頂到部落格列表的頂部。置頂文章將始終顯示在普通文章之前，無論其發布日期如何。

```yaml
pinned: true  # 將此文章置頂
pinned: false # 普通文章（預設）
```

**排序規則：**
1. 置頂文章優先顯示，按發布日期排序（最新在前）
2. 普通文章隨後顯示，按發布日期排序（最新在前）

### 文章級評論控制

`comment` 欄位允許您單獨控制每篇文章評論區的開啟與關閉。

```yaml
comment: true  # 啟用評論（預設）
comment: false # 停用評論
```

**注意：**
此功能需要先在 `src/config.ts` 中啟用評論系統。

## 🧩 Markdown 擴展語法

部落格支援超越標準 GitHub Flavored Markdown 的增強功能：

### 📝 增強寫作
- **提示框：** 使用 `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` 等創建精美的標註框
- **數學公式：** 使用 `$行內$` 和 `$$塊級$$` 語法編寫 LaTeX 數學公式
- **程式碼高亮：** 高級語法高亮，支援行號和複製按鈕
- **GitHub 卡片：** 使用 `::github{repo="使用者/倉庫"}` 嵌入倉庫卡片

### 🎨 視覺元素
- **圖片畫廊：** 自動 PhotoSwipe 整合，支援圖片查看
- **可折疊部分：** 創建可展開的內容區塊
- **自定義元件：** 使用特殊指令增強內容

### 📊 內容組織
- **目錄：** 從標題自動生成，支援平滑滾動
- **閱讀時間：** 自動計算和顯示
- **文章元數據：** 豐富的前言支援，包含分類和標籤

## ⚡ 命令

所有命令都在專案根目錄運行：

| 命令                       | 操作                                    |
|:---------------------------|:---------------------------------------|
| `pnpm install`             | 安裝依賴                               |
| `pnpm dev`                 | 在 `localhost:4321` 啟動本地開發伺服器 |
| `pnpm build`               | 構建生產站點到 `./dist/`（含 Pagefind 索引與字體壓縮） |
| `pnpm preview`             | 在部署前本地預覽構建                   |
| `pnpm check`               | 運行 Astro 錯誤檢查                    |
| `pnpm format`              | 使用 Prettier 格式化程式碼               |
| `pnpm lint`                | 檢查並修復程式碼問題                   |
| `pnpm new-post <檔案名>`   | 創建新部落格文章                       |
| `pnpm astro ...`           | 運行 Astro CLI 命令                    |

## 📄 許可證

本專案基於 Apache 許可證 2.0 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

### 原始專案許可證

本專案基於 [Fuwari](https://github.com/saicaca/fuwari) 開發，該專案使用 MIT 許可證。根據 MIT 許可證要求，原始版權聲明和許可聲明已包含在 LICENSE.MIT 檔案中。

## 🙏 致謝

- 主題基於 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki)（by matsuzaka-yuki）
- 基於原始 [Fuwari](https://github.com/saicaca/fuwari) 模板
- 靈感來源於 [Yukina](https://github.com/WhitePaper233/yukina)、[Firefly](https://github.com/CuteLeaf/Firefly) 和 [Twilight](https://github.com/spr-aachen/Twilight) 模板
- 使用 [Pio](https://github.com/Dreamer-Paul/Pio) 實現可愛的 Live2D 看板娘插件
- 使用 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- 圖標來自 [Iconify](https://iconify.design/)

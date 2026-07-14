# 金字招牌

> A personal blog built with [Astro](https://astro.build) + [Svelte](https://svelte.dev) + [Tailwind CSS](https://tailwindcss.com), based on the [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) theme.

[![Node.js >= 22.12](https://img.shields.io/badge/node.js-%3E%3D22.12-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.1.2-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌐 **Live Site:** https://blog.radarweb.top/
📦 **Repository:** https://github.com/Zhanggl0201/myblog

🌏 **README Languages:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**中文繁体**](./README.tw.md) /

![Preview](./README.webp)

## ✨ Features

### 🎨 Design & Interface
- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth page transitions powered by [Swup](https://swup.js.org/)
- [x] Light/dark theme switching with system preference detection
- [x] Customizable theme colors and dynamic banner carousel
- [x] Fullscreen background images with carousel, opacity, and blur effects
- [x] Fully responsive design for all devices
- [x] Beautiful typography with JetBrains Mono font

### 🔍 Content & Search
- [x] Full-text search powered by [Pagefind](https://pagefind.app/)
- [x] [Enhanced Markdown](#-markdown-extensions) with syntax highlighting
- [x] Interactive table of contents with auto-scrolling
- [x] RSS feed generation
- [x] Reading time estimation
- [x] Article categorization and tagging system

### 📱 Special Pages
- [x] **Anime Tracking Page** - Track anime watching progress and ratings
- [x] **Friends Page** - Beautiful cards showcasing friend websites
- [x] **Diary Page** - Share life moments, similar to social media
- [x] **Archive Page** - Organized timeline view of articles
- [x] **About Page** - Customizable personal introduction

### 🛠 Technical Features
- [x] **Enhanced code blocks** based on [Expressive Code](https://expressive-code.com/)
- [x] **Math formula support** with KaTeX rendering
- [x] **Image optimization** with PhotoSwipe gallery integration
- [x] **SEO optimization** including sitemaps and meta tags
- [x] **Performance optimization** with lazy loading and font subsetting
- [x] **Comment system** with Twikoo integration

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js >= 22.12**
- **pnpm >= 9**

### 📦 Run Locally

```bash
# Clone the repository
git clone https://github.com/Zhanggl0201/myblog.git
cd myblog

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Your blog will be available at `http://localhost:4321`.

### 📝 Content Management

- **Create new posts:** `pnpm new-post <filename>`
- **Edit posts:** Modify files in `src/content/posts/`
- **Customize special pages:** Edit files in `src/content/spec/`
- **Add images:** Place images in `public/` or `src/assets/`

> This project runs in **single-repo mode** — content lives together with the code. `ENABLE_CONTENT_SYNC=false` (content separation is disabled).

## ⚙️ Configuration

Edit `src/config.ts` to customize site information, theme colors, banner images, social links, and feature-page toggles.

Before deploying, update `siteURL` in `src/config.ts` to your domain.

## 🚀 Deployment (GitHub Pages)

This project ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`):

- Pushing to the `main` branch automatically builds and deploys to GitHub Pages.
- The build runs with `ENABLE_CONTENT_SYNC=false` (single-repo mode).
- Make sure `siteURL` in `src/config.ts` is set to `https://blog.radarweb.top/` before deploying.

You can also deploy to any static host such as Vercel, Netlify, or Cloudflare Pages.

## 📝 Post Frontmatter Format

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new blog.
image: ./cover.jpg
tags: [tag1, tag2]
category: Frontend
draft: false
pinned: false
comment: true
lang: en      # Only set when article language differs from site language in config.ts
---
```

### Frontmatter Field Descriptions

- **title**: Article title (required)
- **published**: Publication date (required)
- **description**: Article description for SEO and previews
- **image**: Cover image path (relative to article file)
- **tags**: Array of tags for categorization
- **category**: Article category
- **draft**: Set to `true` to hide article in production
- **pinned**: Set to `true` to pin article to top
- **comment**: Set to `true` to enable article comment area (requires global comment function enabled)
- **lang**: Article language (only set when different from site default)

### Pinned Articles Feature

The `pinned` field allows you to pin important articles to the top of your blog list. Pinned articles will always appear before regular articles regardless of their publication date.

```yaml
pinned: true  # Pin this article to the top
pinned: false # Regular article (default)
```

**Sorting Rules:**
1. Pinned articles appear first, sorted by publication date (newest first)
2. Regular articles follow, sorted by publication date (newest first)

### Article-Level Comment Control

The `comment` field allows you to individually control the enabling and disabling of the comment area for each article.

```yaml
comment: true  # Enable comments (default)
comment: false # Disable comments
```

**Note:** This feature requires the comment system to be enabled in `src/config.ts` first.

## 🧩 Markdown Extensions

The blog supports enhanced features beyond standard GitHub Flavored Markdown:

### 📝 Enhanced Writing
- **Callouts:** Create beautiful annotation boxes using `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.
- **Math Formulas:** Write LaTeX math formulas using `$inline$` and `$$block$$` syntax
- **Code Highlighting:** Advanced syntax highlighting with line numbers and copy buttons
- **GitHub Cards:** Embed repository cards using `::github{repo="user/repo"}`

### 🎨 Visual Elements
- **Image Gallery:** Automatic PhotoSwipe integration for image viewing
- **Collapsible Sections:** Create expandable content blocks
- **Custom Components:** Enhance content with special directives

### 📊 Content Organization
- **Table of Contents:** Automatically generated from headings with smooth scrolling
- **Reading Time:** Automatically calculated and displayed
- **Article Metadata:** Rich frontmatter support with categories and tags

## ⚡ Commands

All commands are run from the project root:

| Command                    | Action                                   |
|:---------------------------|:-----------------------------------------|
| `pnpm install`             | Install dependencies                     |
| `pnpm dev`                 | Start local dev server at `localhost:4321` |
| `pnpm build`               | Build production site to `./dist/` (with Pagefind index & font compression) |
| `pnpm preview`             | Preview build locally before deployment  |
| `pnpm check`               | Run Astro error checking                 |
| `pnpm format`              | Format code with Prettier                |
| `pnpm lint`                | Check and fix code issues                |
| `pnpm new-post <filename>` | Create a new blog post                   |
| `pnpm astro ...`           | Run Astro CLI commands                   |

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Original Project License

This project is based on [Fuwari](https://github.com/saicaca/fuwari), which is licensed under the MIT License. The original copyright notice and permission notice are included in the LICENSE.MIT file in accordance with the MIT License requirements.

## 🙏 Acknowledgements

- Built on the [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) theme (by matsuzaka-yuki)
- Based on the original [Fuwari](https://github.com/saicaca/fuwari) template
- Inspired by [Yukina](https://github.com/WhitePaper233/yukina), [Firefly](https://github.com/CuteLeaf/Firefly) & [Twilight](https://github.com/spr-aachen/Twilight) templates
- Uses [Pio](https://github.com/Dreamer-Paul/Pio) for the Live2D mascot plugin
- Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- Icons from [Iconify](https://iconify.design/)

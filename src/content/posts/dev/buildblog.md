---
title: 基于Astro模板构建一个好看的blog
published: 2025-11-16T12:00:00+08:00
pinned: false
description: 教你如何搭建一个好看的blog
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/AcgExample/13.webp"
tags: [Blog, Astro, Node.js, Mizuki, Firefly]
category: DevOps
draft: false
---
# 第一步：配置环境依赖
## 安装 Node.js
访问 <a href="https://nodejs.org/" target="_blank">Node.js 官网</a> 下载并安装最新版本的 Node.js。建议使用 LTS 版本。

安装完成后，打开终端或命令提示符，运行以下命令验证 Node.js 是否安装成功：
```bash
node -v
npm -v
```
如果显示版本号，则表示安装成功

## 安装pnpm
可以通过npm安装pnpm，代码如下:
```bash
npm install -g pnpm
```
安装完成后，打开终端或命令提示符，运行以下命令验证 pnpm 是否安装成功：

```bash
pnpm -v
```
如果显示版本号，则表示安装成功。

## 安装Git

访问 <a href="https://git-scm.com/" target="_blank">Git 官网</a> 下载并安装最新版本的 Git。

安装完成后，打开终端或命令提示符，运行以下命令验证 Git 是否安装成功：

```bash
git --version
```
如果显示版本号，则表示安装成功。



# 第二步：选择Astor模板并配置博客
#### 这里提供两个开源的Astor模板，你也可以根据自己的需求选择其他模板。
## 1、Mizuki
`Astro-theme-Mizuki`是一个基于`Astro`的现代化静态博客模板，具有丰富的功能和美观的设计，无论您是想写生活类博客、技术类博客、或者是知识库、系列文档等，主题都可以满足您的需求。<br>

::github{repo="matsuzaka-yuki/Mizuki"}

访问 <a href="https://github.com/matsuzaka-yuki/Mizuki" target="_blank">Mizuki</a> 以获取更多支持或赞助作者，本文只介绍如何安装和配置模板，感谢作者的贡献。

<details>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=115095627630222&bvid=BV1rkvTz8ET6&cid=31960993231&p=1&autoplay=0&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
</div>

### 项目启动步骤
#### 1、克隆项目
```bash
git clone https://github.com/matsuzaka-yuki/mizuki.git
cd Mizuki
```

#### 2、安装依赖
```bash
pnpm install
```

#### 3、启动项目
```bash
pnpm dev
```
#### 4、配置博客
您需要根据自己的需求进行配置：

·编辑 `src/config.ts` 文件来自定义博客设置<br>
·更新站点信息、主题颜色、横幅图片和社交链接<br>
·配置翻译设置和特殊页面功能<br>

关于如何配置博客的详细说明，请参考项目的 <a href="https://docs-firefly.cuteleaf.cn/config/siteConfig-usage/" target="_blank">官方文档</a>
#### 5、编写博客文章

在`src/content/posts`文件夹中创建一个新的Markdown文件，按照模板的格式编写博客文章。

</details>

## 2、Firefly
`Firefly`是一款基于`Astro`框架和`Fuwari`模板开发的清新美观且现代化个人博客主题，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。<br>

访问 <a href="https://github.com/CuteLeaf/Firefly" target="_blank">Firefly</a> 以获取更多支持或赞助作者，本文只介绍如何安装和配置模板，感谢作者的贡献。

<details>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=115095627630222&bvid=BV1rkvTz8ET6&cid=31960993231&p=1&autoplay=0&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" ></iframe>
</div>

### 项目启动步骤
#### 1、克隆项目
先 [Fork](https://github.com/CuteLeaf/Firefly/fork) 到自己仓库在克隆（推荐）
```bash
git clone https://github.com/you-github-name/Firefly.git
cd Firefly
```

#### 2、安装依赖
```bash
pnpm install
```

#### 3、启动项目
```bash
pnpm dev
```
#### 4、配置博客
您需要根据自己的需求进行配置：

·编辑 `src/config.ts` 文件来自定义博客设置<br>
·更新站点信息、主题颜色、横幅图片和社交链接<br>
·配置翻译设置和特殊页面功能<br>

关于如何配置博客的详细说明，请参考项目的 <a href="https://docs.mizuki.mysqil.com/Basic-Layout/site-config/" target="_blank">官方文档</a>
#### 5、编写博客文章

在`src/content/posts`文件夹中创建一个新的Markdown文件，按照模板的格式编写博客文章。

</details>

<br>

# 第三步：打包网站

## 1、打包项目
在项目根目录下运行以下命令，将网站打包成静态文件：
```bash
pnpm build
```
## 2、预览静态文件
打包完成后你可以在根目录下运行以下命令，预览静态文件：
```bash
pnpm preview
```
<br>

# 站点构建完毕后，你可以将静态文件部署到任何静态文件服务器上，例如Vercel、Tencent Edgeone等。
## 在<a href="/posts/blogbuild/deploy/" target="_blank" rel="noopener noreferrer">部署站点</a>一章中将介绍如何部署站点
---
title: 部署站点
published: 2025-10-02
pinned: false
description: 教你如何对搭建好的博客进行部署
tags: [Vercel, Tencent Edgeone, GitHub, Git]
category: Examples
draft: false
---
# 部署站点前的准备工作
## 1、GitHub账号
GitHub 账号是部署站点所需的。你可以在<i class="fa-brands fa-github"></i>  [GitHub](https://github.com/join) 注册一个账号。

`!!!注意!!!`  访问Github需要良好的网络环境，否则可能会导致失败。

## 2、项目代码
项目代码是部署站点所需的。你可以在 GitHub 上创建一个新仓库，将项目代码上传到该仓库。

## 3、安装并配置Git，上传项目代码
你可以通过Git命令行工具将项目代码上传到 GitHub 仓库。
<details>
<summary>展开查看Git上传项目代码步骤</summary>

### 第一步：创建 GitHub 仓库
1.登录你的 GitHub 账号

2.点击右上角的 "+" 号，选择 `New repository`

3.填写仓库名称（如：myblog）

4.选择公开（Public）或私有（Private）仓库

5.勾选 `Add a README file`（可选）

6.点击 `Create repository` 创建仓库

### 第二步：上传项目代码（所涉及到的命令均在项目根目录下运行命令行工具）

#### 1.安装Git
你可以在[Git官网](https://git-scm.com/downloads)下载并安装 Git。
安装完成后，在命令行中运行以下命令，检查安装是否成功：
```bash
git --version
```
若出现版本号，说明安装成功。

#### 2.在本地项目目录中，初始化 Git 仓库：
```bash
git init
```
#### 3.添加所有文件到 Git 仓库：
```bash
git add .
```
#### 4.提交更改：
```bash
git commit -m "Initial commit"
```
#### 5.将项目代码推送到 GitHub 仓库：
```bash
git remote add origin https://github.com/yourusername/myblog.git
git branch -M main
git push -u origin main
```
#### 6.上传完成后，你可以在 GitHub 仓库中查看项目代码。

#### 7.后期维护
后期维护时，你可以在本地项目目录中进行修改，然后将修改推送到 GitHub 仓库。

在本地项目目录中，运行以下命令，将修改推送到 GitHub 仓库：
```bash
git add .
git commit -m "Update project"
git push
```

</details>
<br>

# 通过Vercel部署
根据实践来看，部署到[`Vercel`](https://vercel.com/)是比较好的选择

你可以使用 Vercel 零配置的将 Astro 站点部署到其全球边缘网络中。

本指南主要介绍通过 `Vercel CLI` 将 Astro 站点部署到 Vercel 的相关说明。

<details>
<summary>展开查看Vercel部署步骤</summary>

## 1.安装Vercel CLI

<details>
<summary>展开查看Vercel CLI安装步骤</summary>

在项目根目录下运行以下命令，安装 Vercel CLI：
```bash
pnpm install -g vercel
```
当 Vercel CLI 有新版本时，运行任何命令都会显示更新可用信息。

此时可以通过以下命令安装更新：
```bash
pnpm install -g vercel@latest
```

安装完成后，你可以通过以下命令验证安装是否成功：
```bash
vercel --version
```
若出现版本号，说明安装成功。后期也可以通过该命令检查版本号。

</details>

## 2.运行Vercel并登陆账号

<details>
<summary>展开查看Vercel CLI登陆账号步骤</summary>

在项目根目录下运行以下命令，登陆 Vercel 账号：
```bash
vercel login
```
登录成功后，你可以在 Vercel 网站上查看和管理你的部署项目。

## 3.部署项目

<details>
<summary>展开查看Vercel CLI部署步骤</summary>

运行以下命令，将项目部署到 Vercel：
```bash
vercel
```
首次部署时，会提示你输入项目名称。如果不输入，Vercel 会自动为你生成一个名称。

部署过程中，Vercel 会自动检测项目类型为 Astro，并根据 Astro 配置进行部署。在此期间会有许多选择`（通常会有如下几项）`，你可以根据提示进行选择。
```bash
vercel
? Set up and deploy "~/web/my-new-project"? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] n
? What's your project's name? my-new-project
? In which directory is your code located? my-new-project/
Auto-detected project settings (Next.js):
- Build Command: \`next build\` or \`build\` from \`package.json\`
- Output Directory: Next.js default
- Development Command: next dev --port $PORT
? Want to override the settings? [y/N] n
```

部署完成后，Vercel 会提供一个唯一的部署 URL，你可以在浏览器中访问该 URL 查看部署后的站点。（默认是`https://项目名称.vercel.app/`，该URL通常在中国大陆无法访问，因此你需要将其添加到域名解析中，或者使用其他方法（如`ngrok`）进行访问。建议是链接一个自己的域名）

</details>

</details>
<br>

# 通过EdgeOne Pages部署
`EdgeOne Pages` 是`Tencent Cloud`提供的静态网站托管服务，支持自动部署，与 GitHub 集成良好，非常适合部署基于 Astro 的博客。

<details>
<summary>展开查看EdgeOne Pages部署步骤</summary>

## 一、创建EdgeOne Pages项目
### 1.登录 EdgeOne Pages控制台 <a href="https://console.cloud.tencent.com/edgeone/pages" target="_blank">国内</a>/<a href="https://console.tencentcloud.com/edgeone/pages" target="_blank">国际</a>
若首次使用腾讯云，需要先注册账户并完成实名认证，国际版可在控制台顶端切换中文
### 2.点击`创建项目`按钮，填写项目名称（如：myblog），选择公开（Public）或私有（Private）项目，点击`创建`按钮。

</details>
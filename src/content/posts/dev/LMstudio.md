---
title: LM Studio 本地 LLM 部署指南
published: 2026-06-02
pinned: false
draft: false
category: LLM
tags: [LM Studio, LLM, AI, 本地部署, Chatbot]
description: 教你如何运用LM Studio在本地部署一个LLM大模型，以便于无网环境下开展工作
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/HonkaiStarRail/RuanMei/019.webp"
---

# 🚀 LM Studio 本地 LLM 部署指南

本指南旨在帮助您快速上手 LM Studio，完成本地大语言模型的下载、配置和启动，使其能够作为独立的聊天界面或作为 API 服务供其他程序调用。

::github{repo="lmstudio-ai/lmstudio"}

## 🎯 第一步：准备工作 (Prerequisites)

在开始之前，请确保您的系统满足以下要求：

1. **硬件要求（强烈推荐）：**
    * **GPU (显卡):** NVIDIA GPU 是最佳选择（支持 CUDA 加速）。至少需要 8GB VRAM 以上才能流畅运行中等大小的模型。
    * **CPU:** 现代多核 CPU（如 Intel i5/Ryzen 5 或更高）。
    * **内存 (RAM):** 16GB 或更多。
2. **软件要求：**
    * **LM Studio:** 从 [LM Studio 官网](https://lmstudio.ai/) 下载对应您操作系统的版本（Windows, macOS, Linux）。或[点击此处](https://mz5k-my.sharepoint.com/:u:/g/personal/zhugeliang_mz5k_onmicrosoft_com/IQAChX_s_3FRQalqlIqJphyLASvuToKq7ghx3SUDBhVSwEo?e=rzXtOM) 下载适用于Windows的v0.4.15.2版本，此版本非最新。

## 📥 第二步：下载或导入模型 (Model Acquisition)

LM Studio 的核心是模型文件（通常是 GGUF 格式），下面讲两种导入模型的方法。
### 在线获取
---
1. **打开 LM Studio。**
2. **进入搜索界面 (Search Tab - 通常是左侧的放大镜图标)。**
3. **搜索目标模型：** 输入您想使用的模型名称，例如 `Llama 3`、`Mistral` 或 `Qwen`。
4. **选择合适的量化版本 (Quantization)：** 这是最关键的一步！
    * 在搜索结果页面的右侧列表中，您会看到多个文件（如 `Q4_K_M`, `Q5_K_S`, `GGUF`）。
    * **推荐规则：**
        * **VRAM 充足 (12GB+):** 选择 `Q6_K` 或 `Q8_0` 以获得最高精度。
        * **内存适中 (8-12GB VRAM):** 选择 `Q5_K_M`（这是最平衡的选择）。
        * **资源受限 (< 8GB VRAM):** 选择 `Q4_K_M` 或更低的 `Q3_K_S` 以保证运行速度。
5. **下载模型：** 点击您选择的那个文件旁边的 **"Download"** 按钮，等待模型文件（通常是几 GB 到几十 GB）下载完成。
---

### 本地导入
---
1. **打开 LM Studio。**
2. **进入模型界面 (Models - 通常是左侧三个矩形叠放图标)。**
3. **点击右下角`...`**
    * 选择`更改`，将模型路径更改为你的模型路径
    * 或者是选择`在文件资源管理器中打开`，定位到默认模型路径，将你的模型放进去
    * 模型文件可在[魔搭社区](https://www.modelscope.cn/models)获取
    * 我提供了一些资源，[点击查看](https://mz5k-my.sharepoint.com/personal/zhugeliang_mz5k_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fzhugeliang%5Fmz5k%5Fonmicrosoft%5Fcom%2FDocuments%2Fshare%2FAI&viewid=a20df44b%2Ddf18%2D4e64%2D9027%2D2a64552e8a49&ga=1)
---
## ⚙️ 第三步：配置与加载模型 (Configuration & Loading)

下载完成后，您需要告诉 LM Studio 如何运行这个模型。

1. **进入聊天界面 (Chat Tab - 通常是左侧的对话气泡图标)。**
2. **选择模型：** 在界面的顶部下拉菜单中，选择您刚刚下载好的那个 GGUF 模型文件。
3. **配置硬件加速（关键优化）：** 在聊天窗口的右侧面板中，找到 **"Hardware Settings"** 或 **"Model Configuration"** 部分。
    * **GPU Offload (或 Layers):** 这是决定性能的关键设置。将滑块拖动到最大值（或设置为模型总层数）。这会将模型的计算层加载到您的显存 (VRAM) 中，极大地提升速度。
        * *💡 提示：如果 VRAM 不够，不要设为最大值，留出一些空间给操作系统和其他程序。*
    * **Context Size:** 设置上下文窗口大小（Token 数）。默认值通常足够，但如果您需要模型记住更长的对话历史，请调高它（如 4096, 8192 或更高）。

## 💬 第四步：运行与测试 (Running & Testing)

现在，您的模型已经“部署”到 LM Studio 的内存中了。

1. **开始聊天：** 在底部的输入框中输入您的问题（Prompt），然后点击发送。
2. **观察性能：**
    * **速度快 (Tokens/s 高):** 说明 GPU 加速配置成功，模型运行流畅。
    * **速度慢 (Tokens/s 低):** 可能说明 VRAM 不足，或者您没有充分利用 GPU。

---

## 🌐 第五步：部署为 API 服务 (API Deployment) —— 进阶用法

如果您想让其他程序（如 VS Code 插件、自定义 Python 脚本、Web 前端）来调用您的本地 LLM，您需要启动一个 **Local Server**。

1. **切换到服务器界面 (Server Tab - 通常是左侧的插头/网络图标)。**
2. **选择模型：** 在顶部的下拉菜单中，再次确认您要运行的模型已选中。
3. **配置 API 参数（可选）：** 您可以调整 `Port`（默认 1234）、`Context Size` 等参数。
4. **点击 "Start Server" (启动服务器)。**

### ✅ 部署成功标志：
当服务器启动后，LM Studio 会显示一个成功的提示，并告诉您 API 的地址，通常是：
`http://localhost:1234/v1`
### 🛠️ 如何使用这个 API？
现在，任何支持 OpenAI 兼容 API 的客户端（如 `curl` 命令、Python 的 `openai` 库）都可以将请求发送到 `http://localhost:1234/v1/chat/completions` 来与您的本地模型对话了！

---

## 🛠️ 故障排除速查表 (Troubleshooting)

| 问题现象 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| **启动时报错，提示内存不足。** | 模型太大，或 VRAM/RAM 不足。 | 1. 选择更小的量化版本（如从 Q8_0 降到 Q4_K_M）。 2. 关闭其他占用大量显存的程序。 |
| **聊天速度极慢 (Tokens/s < 5)。** | GPU 加速未启用或配置错误。 | 检查右侧面板，确保 **GPU Offload Layers** 设置得足够高（尽量等于模型总层数）。 |
| **API 服务器启动后立即崩溃。** | 模型文件损坏或与当前 LM Studio 版本不兼容。 | 重新下载该模型的 GGUF 文件，并尝试更换一个不同系列的模型进行测试。 |
| **聊天界面卡顿，但 API 运行正常。** | 可能只是 UI 渲染线程被阻塞。 | 尝试重启 LM Studio；如果问题依旧，请检查您的显卡驱动是否是最新版本。 |
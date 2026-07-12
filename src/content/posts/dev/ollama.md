---
title: Ollama 本地 LLM 部署指南
published: 2026-06-04
pinned: false
draft: false
category: LLM
tags: [Ollama, LLM, AI, 本地部署, API, CLI]
description: 教你如何使用 Ollama 快速部署本地大语言模型，一行命令即可运行
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/AcgExample/10.webp"
---

# 🚀 Ollama 本地 LLM 部署指南

Ollama 是一个轻量级的本地大语言模型运行框架，相比 LM Studio，它更简洁、启动更快，适合命令行用户和需要快速集成的场景。

::github{repo="ollama/ollama"}

## 🎯 第一步：准备工作 (Prerequisites)

1. **硬件要求（强烈推荐）：**
    * **GPU (显卡):** NVIDIA GPU（支持 CUDA）、AMD GPU（支持 ROCm）或 Apple Silicon（M1/M2/M3/M4 均可）。
    * **CPU:** 现代多核 CPU（如 Intel i5/Ryzen 5 或更高）。
    * **内存 (RAM):** 16GB 或更多。
2. **软件要求：**
    * **Ollama:** 从 [Ollama 官网](https://ollama.com/) 下载对应您操作系统的版本（Windows, macOS, Linux）。

## 📥 第二步：安装 Ollama

### Windows / macOS
1. 访问 [Ollama 官网](https://ollama.com/) 下载安装包。
2. 双击安装包，按提示完成安装。
3. 安装完成后，Ollama 会自动在后台运行。

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 验证安装
```bash
ollama --version
```
如果显示版本号，说明安装成功。

## 📦 第三步：下载与运行模型 (Model Download & Run)

Ollama 的核心优势：**一行命令即可下载并运行模型**，无需手动选择量化版本。

### 常用模型速查

| 模型 | 命令 | 大小 | 推荐显存 |
| :--- | :--- | :--- | :--- |
| Qwen2.5 7B | `ollama run qwen2.5` | ~4.7GB | 8GB+ |
| Qwen2.5 14B | `ollama run qwen2.5:14b` | ~9GB | 16GB+ |
| Llama 3.1 8B | `ollama run llama3.1` | ~4.7GB | 8GB+ |
| DeepSeek-R1 7B | `ollama run deepseek-r1` | ~4.7GB | 8GB+ |
| DeepSeek-R1 14B | `ollama run deepseek-r1:14b` | ~9GB | 16GB+ |
| Mistral 7B | `ollama run mistral` | ~4.1GB | 8GB+ |
| Gemma2 9B | `ollama run gemma2` | ~5.4GB | 8GB+ |

### 运行模型
```bash
# 下载并运行（首次会自动下载，后续直接启动）
ollama run qwen2.5
```

首次运行时，Ollama 会自动下载模型并选择最适合你硬件的量化版本。下载完成后，你就可以直接在终端中与模型对话了。

### 管理已下载的模型
```bash
# 查看已下载的模型列表
ollama list

# 删除不需要的模型（释放磁盘空间）
ollama rm qwen2.5

# 查看模型详细信息
ollama show qwen2.5
```

## ⚙️ 第四步：Modelfile 自定义模型 (Advanced)

如果你有自定义的 GGUF 模型文件，可以通过 Modelfile 导入 Ollama。

### 创建 Modelfile
```bash
# 创建 Modelfile
cat > Modelfile << 'EOF'
FROM ./my-model.gguf

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096

SYSTEM """你是一个有用的AI助手，请用中文回答问题。"""
EOF
```

### 导入模型
```bash
# 基于 Modelfile 创建自定义模型
ollama create my-model -f Modelfile

# 运行自定义模型
ollama run my-model
```

## 🌐 第五步：部署为 API 服务 (API Deployment)

Ollama 启动后**默认自动开启 API 服务**，无需额外配置。

### 默认 API 地址
```
http://localhost:11434
```

### 测试 API
```bash
# 测试连接
curl http://localhost:11434/api/tags

# 发送对话请求
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}'
```

### OpenAI 兼容接口

Ollama 同时提供 OpenAI 兼容的 API 格式，方便与现有工具集成：

```bash
curl http://localhost:11434/v1/chat/completions -d '{
  "model": "qwen2.5",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}'
```

### 在代码中使用

**Python (openai 库)：**
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Ollama 不需要真实 API Key
)

response = client.chat.completions.create(
    model="qwen2.5",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

**Node.js：**
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
});

const response = await client.chat.completions.create({
    model: 'qwen2.5',
    messages: [{ role: 'user', content: '你好' }],
});
console.log(response.choices[0].message.content);
```

## 🔧 第六步：环境变量配置 (Configuration)

Ollama 通过环境变量进行配置：

| 环境变量 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `OLLAMA_HOST` | API 监听地址 | `127.0.0.1:11434` |
| `OLLAMA_MODELS` | 模型存储路径 | `~/.ollama/models` |
| `OLLAMA_NUM_PARALLEL` | 并行请求数 | 1 |
| `OLLAMA_MAX_LOADED_MODELS` | 最大加载模型数 | 1 |
| `OLLAMA_KEEP_ALIVE` | 模型保持加载的时间 | `5m` |
| `OLLAMA_ORIGINS` | 允许的跨域来源 | 空 |

### 允许局域网访问示例
```bash
# Windows (PowerShell)
$env:OLLAMA_HOST="0.0.0.0:11434"

# Linux / macOS
export OLLAMA_HOST=0.0.0.0:11434
```

## 🖥️ 第七步：搭配图形界面 (Web UI)

Ollama 本身只有命令行界面，但可以搭配第三方 Web UI 使用：

### Open WebUI（推荐）
```bash
# 使用 Docker 一键部署
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

访问 `http://localhost:3000` 即可使用类似 ChatGPT 的界面。

### 其他选择
- **Chatbox:** 桌面客户端，支持连接 Ollama API
- **AnythingLLM:** 支持文档问答的桌面应用
- **Page Assist:** 浏览器扩展，在网页中使用本地模型

## 🛠️ 故障排除速查表 (Troubleshooting)

| 问题现象 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| **模型下载速度慢** | 默认连接国外服务器 | 设置代理：`export https_proxy=你的代理地址` |
| **运行时报错显存不足** | 模型太大 | 1. 选择更小的模型（如 7B 而非 14B） 2. 关闭其他占用显存的程序 |
| **GPU 未被识别** | 驱动问题 | 1. 更新显卡驱动 2. NVIDIA 需安装 CUDA 3. AMD 需安装 ROCm |
| **API 无法从其他设备访问** | 默认只监听 localhost | 设置 `OLLAMA_HOST=0.0.0.0:11434` |
| **模型加载后自动卸载** | keep_alive 超时 | 设置 `OLLAMA_KEEP_ALIVE=24h` 延长保持时间 |
| **跨域请求被拒绝** | CORS 限制 | 设置 `OLLAMA_ORIGINS=*` 允许所有来源 |

---

## 📊 Ollama vs LM Studio 对比

| 特性 | Ollama | LM Studio |
| :--- | :--- | :--- |
| 界面 | 命令行 | 图形界面 |
| 上手难度 | 低（一行命令） | 低（可视化操作） |
| 模型格式 | 自有格式 + GGUF | GGUF |
| API 服务 | 默认开启 | 需手动启动 |
| OpenAI 兼容 | 支持 | 支持 |
| 自定义模型 | Modelfile | 直接导入 |
| 适合场景 | 开发者、自动化、服务端 | 桌面用户、非技术用户 |

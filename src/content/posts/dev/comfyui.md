---
title: AI绘图之ComfyUI基础部署指北
published: 2026-06-28
pinned: false
draft: false
category: AIGC
tags: [ComfyUI, AIGC, AI绘图, Stable Diffusion, GGUF, 工作流]
description: 教你如何部署一个简单的ComfyUI工作流并绘制一张图片
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/HonkaiStarRail/SilverWolf/002.webp"
---

# 🚀 AI绘图之ComfyUI基础部署指北

本教程旨在帮助您快速上手 ComfyUI，完成本地模型的部署、基础工作流搭建，并生成第一张 AI 绘图作品。

::github{repo="comfyanonymous/ComfyUI"}

## 🎯 准备工作 (Prerequisites)

在开始之前，请确保您的系统满足以下要求：

1. **硬件要求**

    **📊 显卡（GPU）与显存（VRAM）快速对照表 —— 按模型规格选卡**

    | 模型规格（B = 十亿参数） | 代表模型 | 推荐 GPU 型号 | 所需 VRAM（FP16/全精度） | 所需 VRAM（INT8 量化） | 所需 VRAM（INT4/GGUF 量化） |
    |:---|:---|:---|:---|:---|:---|
    | **8B 级别**（入门级大模型） | 小型 Flux 变体、SDXL Turbo | **RTX 3060 12GB / RTX 4060 16GB**（最低门槛） | 不可用（OOM） | 8–10 GB | **6–8 GB**（可跑 1024×1024） |
    | **12–16B 级别**（主力级） | Z-Image-Turbo 主模型 | **RTX 4070 Ti Super 16GB / RTX 3080 12GB**（主力玩家） | 不可用（OOM） | 12–14 GB | **8–10 GB**（GGUF 全流程） |
    | **20–30B 级别**（高阶） | Flux.1 dev、Flux.1 pro | **RTX 4080 Super 16GB / RTX 4090 24GB**（高阶玩家） | 24–32 GB | 16–20 GB | **10–14 GB**（GGUF 可跑） |
    | **50B+ 级别**（旗舰级） | 超大图像模型 | **RTX 4090 24GB / A100 40GB+**（专业/工作站） | 48 GB+ | 28–36 GB | **16–22 GB**（GGUF 最低） |

    > **示例Z-Image-Turbo** 主模型约 12–16B 参数，Text Encoder（Qwen3-4B）约 4B 参数。**GGUF INT4 量化版整套可在 8–10GB VRAM 下运行**，适合 RTX 3060 12GB、RTX 4060 16GB 等中端显卡。

    **✅ GPU 选择原则：**
    * **首选 NVIDIA** —— ComfyUI 全生态依赖 CUDA，兼容度 100%
    * **显存比算力更重要** —— 优先看 VRAM 容量，其次看 CUDA 核心数
    * **同价位优先大显存** —— 例如 4060 16GB > 4070 12GB（AI 绘图场景）
    * **AMD/Intel ARC 可用但需额外配置** —— 需启用 ROCm 或 IPEX，自定义节点兼容度约 70%，新手不推荐

    **🖥️ CPU 建议：**
    * **最低配置：** 4 核 8 线程（如 Intel i3-12100 / AMD Ryzen 3 4100）
    * **推荐配置：** 6 核 12 线程（如 Intel i5-13400 / AMD Ryzen 5 7600X）
    * **说明：** CPU 主要影响模型加载速度和节点预处理，**核心数比主频更关键**。绘图过程主要由 GPU 承担，CPU 不会成为瓶颈。

    **💾 内存（RAM）建议：**
    | 显卡 VRAM | 推荐系统 RAM | 用途说明 |
    |:---|:---|:---|
    | 8–12 GB | **16 GB** | 基础运行 |
    | 16–24 GB | **32 GB** | 舒适使用，支持多标签页 |
    | 24 GB+ | **64 GB** | 大型工作流、批量生成、LORA 训练 |

    **💽 硬盘空间建议：**
    * **最低配置：** 50 GB（仅放一套模型）
    * **推荐配置：** 200 GB+ SSD（NVMe 更佳）—— 用于存放主模型（5–15GB）、VAE（数百 MB）、Text Encoder（2–8GB）、LoRA（数百 MB 到数 GB）、ControlNet 等辅助模型
    * **最佳配置：** 1 TB+ NVMe SSD —— 加载速度提升显著，GGUF 模型从磁盘读取到显存的速度快数倍
    * **说明：** 机械硬盘可以放模型但加载极慢，**强烈建议至少把当前使用的模型放在 SSD 上**。

2. **软件要求**
    * **Git（可选）：** 从 [Git 官网](https://git-scm.com/) 下载并安装，主要用于手动安装自定义节点。官方安装包已通过 Manager 内置了节点安装功能，**通常不需要单独安装 Git**。
    * **Python 3.12 或更高（可选）：** 从 [Python 官网](https://www.python.org/downloads/) 下载 **3.12 或 3.13 版本**。如果使用官方安装包或便携版，**已自带 Python，无需单独安装**。仅 Git 克隆方式需要手动配置。
    * **ComfyUI 本体安装：**
        - **方式一（最推荐，新手首选 ✅）：** 从 [ComfyUI 官网](https://comfy.org/zh-CN/) 下载 **官方安装包（ComfyUI-Manager Setup）**。它会**自动检测您的显卡（NVIDIA / AMD / Intel ARC）** 并配置对应的加速环境，无需手动选择版本。**自带 ComfyUI-Manager 管理器**，能一键启动、一键更新，几乎零配置门槛。
        - **方式二（免安装便携版）：** 直接下载 [ComfyUI Windows 便携包](https://github.com/comfyanonymous/ComfyUI/releases)，解压后双击 `run_nvidia_gpu.bat`（N卡）或 `run_cpu.bat`（其他卡）即可使用，无需安装任何依赖。缺点是不含 Manager，需手动安装自定义节点，且**不会自动检测 AMD/Intel 加速**。
        - **⚠️ 不推荐新手使用 Git 克隆方式** —— 需要手动配置 Python、PyTorch、CUDA 等依赖，容易出现各种环境报错。等您对 ComfyUI 熟悉后再考虑这种方式。


## 📦 第一步：安装 ComfyUI 本体

### 方式一：官方安装包（最推荐，新手首选 ✅）
---
1. **从 [ComfyUI 官网](https://comfy.org/download/windows/nsis/x64) 下载安装包**，双击运行安装程序。
2. **按安装向导操作：** 安装程序会**自动检测您的显卡类型（NVIDIA / AMD / Intel ARC）**，并配置对应的加速环境（CUDA / ROCm / IPEX），**无需手动选择版本**。
    * 安装路径建议选择剩余空间较大的磁盘（至少 200GB 可用）。
    * 路径中**不要有中文或特殊字符**，否则可能导致模型加载失败。
3. **首次启动：** 安装完成后，桌面上会出现 ComfyUI 快捷方式，双击打开。
4. **启动 ComfyUI-Manager：** 安装包已自带 Manager，界面右上角或右键菜单中可以找到它，用于安装自定义节点和模型。
5. **浏览器会自动打开** `http://127.0.0.1:8188`，即可看到 ComfyUI 工作流界面。
---

### 方式二：Windows 便携包（免安装）
---
1. **从 [GitHub Releases](https://github.com/comfyanonymous/ComfyUI/releases) 下载对应显卡的便携包**（文件名通常类似 `ComfyUI_windows_portable.zip`）。
2. **解压到任意目录**（路径中**不要有中文或空格**，否则可能出错）。
3. **双击运行 `run_xxx(显卡版本).bat`**。
4. **等待首次启动：** 首次运行会自动下载依赖包，请耐心等待命令行窗口不再滚动。
5. **浏览器打开：** `http://127.0.0.1:8188` 即可看到 ComfyUI 界面。
6. **注意：** 便携版不含 `ComfyUI-Manager`，需要手动安装。可以在[GitHub]()下载最新的 `ComfyUI-Manager` 压缩包，解压到 `ComfyUI/custom_nodes/` 目录下，重启 ComfyUI 即可使用。
---


## 📥 第二步：下载与放置模型 (Model Acquisition)

本教程以 `Z-Image-Turbo-GGUF` 模型为例，您需要准备三个文件：**主模型（扩散模型，`.gguf`）**、**VAE（`ae.safetensors`）**、以及 **Text Encoder（`.gguf`）**。

**下载模型文件：**
[Z-Image-Turbo-GGUF](https://mz5k-my.sharepoint.com/:f:/g/personal/zhugeliang_mz5k_onmicrosoft_com/IgCLIgnEd1s4RauU79mrIJ6iAbVlepHHhG6M81ZXrpEqBG0?e=1bCxSc)

---
本教程所使用的 Z-Image-Turbo **主模型（扩散模型）和 Text Encoder 都是 GGUF 量化格式**，只有 VAE 保持 safetensors 格式。三个核心文件放置目录如下：

1. **主模型（Diffusion Model / UNet，GGUF 格式）** → `ComfyUI/models/llm/` 或 `ComfyUI/models/unet/` 或 `ComfyUI/models/checkpoints/`
    * 文件名示例：`z_image_turbo-Q8_0.gguf`

2. **VAE 模型** → `ComfyUI/models/vae/`
    * 文件名示例：`ae.safetensors`（VAE 文件名通常就是 ae.safetensors，safetensors 格式，为了方便区分可以重命名为对应模型）
    * 教程提供的文件名为 `ziamgeturbo.safetensors`
3. **Text Encoder（文本编码器，GGUF 格式）** → `ComfyUI/models/llm/` 或 `ComfyUI/models/text_encoders/`
    * 文件名示例：`Qwen3-4B-Q8_0.gguf`
    * **GGUF 是 llama.cpp 的原生量化格式**，对显存极其友好，Q4/Q5 量化版在质量与速度间平衡最佳。

**放置步骤：**
1. 进入 ComfyUI 安装目录下的 `models/` 文件夹。

2. 分别进入上述三个子目录，将对应的文件放入。
    * 如果 `unet/`、`text_encoders/` 或 `llm/` 目录不存在，手动创建同名文件夹即可。

3. 更多模型可在以下网站获取：
    * [Hugging Face](https://huggingface.co/)（官方模型聚集地，GGUF 文件通常在 `-GGUF` 后缀的仓库中）
    * [魔搭社区 ModelScope](https://www.modelscope.cn/)（国内下载速度快）
    * [Civitai](https://civitai.com/)（社区模型丰富）

---


## ⚙️ 第三步：启动 ComfyUI (Startup)、搭建基础工作流 (Basic Workflow)

### 模型放置完毕后，按照第一步的说明启动comfyui即可。

### 搭建基础工作流

**重要提示：** GGUF 格式**不能直接用默认节点加载**
由于教程所使用的 Z-Image-Turbo 主模型和 Text Encoder 都是 GGUF 格式，您在搭建工作流前，需要先安装Comfyui-GGUF自定义节点。
#### 安装自定义节点 (Custom Nodes)

ComfyUI 的强大之处在于丰富的第三方节点扩展。推荐通过 **ComfyUI-Manager** 来管理节点：

**官方安装包用户：** 您的安装包**已自带 Manager**，在 ComfyUI 界面的**右上角或右键菜单**中即可找到 `Manager` 选项，点击即可搜索、安装、更新自定义节点。

**便携包用户：** 便携版不含 `ComfyUI-Manager`，需要手动安装。可以在[GitHub](https://github.com/Comfy-Org/ComfyUI-Manager)下载最新的 `ComfyUI-Manager` 压缩包，解压到 `ComfyUI/custom_nodes/` 目录下，重启 ComfyUI 即可使用。

**安装 GGUF 相关节点的步骤：**
1. 在 Manager 中搜索 `GGUF`
2. 找到 `Comfyui-GGUF` 节点包，点击安装
3. 等待安装完成后，**重启 ComfyUI**
4. 现在您应该能在节点列表中看到 `Unet Loader(GGUF)`、`CLIPLoader(GGUF)` 等节点了

### Z-Image-Turbo-GGUF 基础文生图工作流搭建
1. **Unet Loader(GGUF)：**  加载 GGUF 版 Z-Image-Turbo 主模型
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`GGUF`，选择`Unet Loader(GGUF)`，在unet_name下拉菜单中选择``z_image_turbo-Q8_0.gguf``。

2. **CLIPLoader(GGUF)：**   加载 GGUF 版 Qwen3-4B模型，用于处理提示词
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`GGUF`，选择`CLIPLoader(GGUF)`，在clip_name下拉菜单中选择``Qwen3-4B-Q8_0.gguf``。
    * **注意：** 此处必须使用支持 GGUF 的加载节点。如果找不到此类节点，请先安装 GGUF 自定义节点。

3. **加载VAE(Load VAE)：**    加载 Z-Image-Turbo 专用 VAE
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`VAE`，选择`加载VAE`，在vae名称下拉菜单中选择`ziamgeturbo.safetensors`。
    * **注意：** 以上三个节点的输出分别是 `模型(model)`、`VAE`、`CLIP`，分别连接到后续节点的对应输入。  

4. **提示词编码节点 — 正向提示词：**    编码正向提示词
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`CLIP`，选择`CLIP文本编码(CLIPTextEncode)`，将该节点添加至工作流。
    * 添加到画布后可以右键该节点对其重命名，更改颜色，更改形状等，以便与负向提示词区分。
    * 示例（zimageturbo对中文支持）：`一只可爱的猫咪，杰作，最高质量，8k分辨率` 或 `a cute cat, masterpiece, best quality, 8k`
    * 将 `CLIPLoader(GGUF)` 的输出连接到此节点的模型输入。

5. **提示词编码节点 — 反向提示词：** 与正向提示词同理，用于编码您**不想**出现的内容。
    * 添加到画布后可以右键该节点对其重命名，更改颜色，更改形状等，以便与向提示词区分。    
    * 示例：`低质量，模糊，畸形` 或 `low quality, blurry, bad anatomy`
    * 将 `CLIPLoader(GGUF)` 的输出连接到此节点的模型输入。

6. **空Latent图像(Empty Latent Image)** ：  设置图片分辨率
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`Latent`，选择`空Latent图像(Empty Latent Image)`，可以先从`512x512`尝试。

7. **K采样器(KSampler)：** 设置生成参数
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`K采样器(KSampler)`，选择`K采样器(KSampler)`，
    * `seed`（随机种子）：留空为随机，填入固定数字可复现图片
    * `steps`（步数）：zimageturbo建议 8-10。
    * `cfg`（提示词权重）：1
    * `sampler_name`（采样器）：推荐 `euler` 
    * `scheduler`（调度器）：推荐 `simple`
    * 将 `Unet Loader(GGUF)`节点的 `模型(MODEL)` 输出连接到此节点的 `模型(model)` 输入。
    * 将`正向提示词`节点的`条件`输出连接到此节点的`正面条件`。
    * 将`负向提示词`节点的`条件`输出连接到此节点的`负面条件`。
    * 将`空Latent图像 Empty Latent Image`节点的`Latent`输出连接到此节点的`Latent图像`。

8. **VAE解码(VAE Decode)：** 将潜空间图像转换为真实图像。
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`VAE解码(VAE Decode)`，选择`VAE解码(VAE Decode)`。
    * 将 `Load VAE` 的 `VAE` 输出连接到此节点的 `vae` 输入。
    * 将`K采样器(KSampler)`的`Latent`输出连接到此节点的`Latent`输入。

9. **保存图像(Save Image)：**
    * 在空白处双击鼠标左键，然后在弹出的搜索框中搜索`保存图像`，选择`保存图像（Save Image）`。
    * 将`VAE解码(VAE Decode)`的`图像`输出节点连接到此节点的`图片`。
    * 生成的图片会自动保存在`output`文件夹并按照设定的命名规则命名。
    * 如果不想自动保存可以更换该节点为`预览图像(Preview Image)`，也可以添加一个`预览图像(Preview Image)像`节点与`保存图像(Save Image)`共存。


### 导入他人的工作流 (Workflow)

很多作者会分享工作流的 JSON 文件或截图（ComfyUI 图片内嵌工作流数据）：

1. **从 JSON 导入：** 点击菜单栏 `Load`，选择工作流 JSON 文件，或直接将工作流 JSON 文件**拖入 ComfyUI 界面**。

2. **从图片导入：** 直接将带有工作流信息的 PNG 图片**拖入 ComfyUI 界面**，即可还原整个工作流。

## 🎨 第四步：生成第一张图片 (Generate Your First Image)

现在工作流已经搭建完成，让我们来生成图片吧！

1. **确认三组件已正确加载：**
    * 在 `Unet Loader(GGUF)` 中选择主模型 GGUF 文件（如 `z_image_turbo-Q8_0.gguf`）
    * 在 `CLIPLoader(GGUF)` 中选择 Text Encoder GGUF 文件（如 `Qwen3-4B-Q8_0.gguf`）
    * 在 `加载VAE(Load VAE)` 中选择 `ziamgeturbo.safetensors`
    
2. **确认节点连线：**
    * `Unet Loader(GGUF)` 的 `模型(MODEL)` → `K采样器(KSampler)` 的 `模型(model)`
    * `CLIPLoader(GGUF)r` 的输出 → 两个 `CLIP文本编码(CLIPTextEncode)` 节点的模型输入
    * `加载VAE(Load VAE)` 的 `VAE` → `VAE解码(VAE Decode)` 的 `vae`
    
3. **检查K采样器(KSampler)参数** 

4. **输入提示词：** 在两个 `CLIP文本编码(CLIPTextEncode)` 节点中分别输入正向和反向提示词（支持中文）。

5. **设置画布大小：** 在 `空Latent图像(Empty Latent Image)` 中设置 `高度(height)` 和 `宽度(width)`。

6. **点击右侧的`运行`按钮：** 工作流开始执行！首次运行会加载两个 GGUF 模型，需要几十秒。

7. **观察命令行输出：** 可以看到执行进度和 `it/s`（每秒迭代数）。

8. **查看生成结果：** 图片生成完成后会显示在 `保存图像(Save Image)` 和 `预览图像(Preview Image)` 节点上。

---


---

## 🛠️ 故障排除速查表 (Troubleshooting)

| 问题现象 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| **启动时报错 `CUDA out of memory`（显存不足）。** | 图片分辨率太高，或模型太大。 | 1. 降低图片分辨率。 2. 全 GGUF 版整套模型可在 **8-10GB VRAM** 下运行，显存不足可以尝试更低的量化档位（如 Q3_K_M）。 3. 关闭其他占用大量显存的程序。 |
| **图片生成速度极慢 (1s/it 或更慢)。** | GPU 加速未启用，或 GGUF 使用了 CPU 模式。 | **官方安装包用户：** 安装时已自动检测并配置 GPU 加速，如遇速度慢请检查显卡驱动是否为最新版本；在两个 GGUF 节点中**将 `n_gpu_layers` 设为 9999**。 **便携包用户：** 确认运行的是 `run_nvidia_gpu.bat`（N卡）而不是 `run_cpu.bat`。
| **加载模型后界面无反应或报错。** | 主模型/VAE/Text Encoder 三者不匹配，或 GGUF 节点未正确安装。 | 1. 确认三个文件（**两个 `.gguf` + `ae.safetensors`**）均来自 Z-Image-Turbo 同一套模型。 2. 确认使用的是 **`Load GGUF Diffusion Model`** 节点（**不是 `Load Diffusion Model`**）和 **`Load GGUF Text Encoder`** 节点（**不是 `Load CLIP`，也不是 `Load Text Encoder`**）。 3. 检查文件路径中**不要有中文或特殊字符**。 4. 确保已安装 `Comfy-Org/z_image_turbo` 官方自定义节点或同时包含扩散模型 GGUF + Text Encoder GGUF 的节点。 |
| **找不到 GGUF Diffusion 节点。** | 未安装支持扩散模型 GGUF 的自定义节点。 | **推荐方式（官方安装包用户）：** 在 ComfyUI-Manager 中搜索 `z_image_turbo`，安装 `Comfy-Org/z_image_turbo` 节点包，重启 ComfyUI。 **便携包用户：** 在 Manager 的 GitHub 仓库下载压缩包，解压到 `custom_nodes/` 目录，重启。 |
| **加载 GGUF 时报错 `no model file found` 或 `llama.cpp` 加载失败。** | llama-cpp-python 依赖未安装，或 GGUF 文件路径不对。 | 1. **官方安装包用户：** 依赖通常已自动安装，如遇问题可在 Manager 中重新安装 `z_image_turbo` 节点。 2. **便携包用户：** 在便携包的 `python_embeded` 环境中执行 `pip install llama-cpp-python`。 3. 确认 `.gguf` 文件确实放在了 `models/llm/` 目录下。 4. 尝试用 7-Zip 验证 GGUF 文件是否损坏。 |
| **加载 GGUF 时 `RAM` 暴增甚至卡死。** | `n_gpu_layers` 设为 0，完全用 CPU 加载。 | **两个 GGUF 节点（主模型和 Text Encoder）的 `n_gpu_layers` 都要设为 9999，将两个 GGUF 模型都 offload 到 GPU 显存。 |
| **生成的图片全是黑图或噪点。** | VAE 问题，或提示词编码方式不对。 | 1. 确认使用的是 Z-Image-Turbo 的 `ae.safetensors`，不要混用其他模型的 VAE。 2. 降低 `cfg` 值（如从 15 降到 7）。 3. 确认使用的是 `GGUF Text Encode`/`LLM Encode` 节点，**不是** `CLIP Text Encode`。 |
| **生成的图片出现畸形/错位/解剖错误。** | 采样步数不足，或提示词质量差。 | 1. 增加 `steps` 到 30 以上。 2. 在反向提示词中加入 `bad anatomy, bad hands, missing fingers` 或 `低质量，畸形，手部缺失`（中文）。 3. 尝试切换 `sampler_name`（如 `dpmpp_2m` 配合 `karras`）。 |
| **自定义节点安装后报错。** | 节点缺少依赖或与 ComfyUI 版本不兼容。 | 1. 通过 ComfyUI Manager 更新节点。 2. 检查节点仓库的 README 是否需要额外安装依赖（GGUF Diffusion 节点通常需要 `llama-cpp-python`）。 3. 暂时移除有问题的节点文件夹。 |
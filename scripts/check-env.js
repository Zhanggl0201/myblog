#!/usr/bin/env node

/**
 * Mizuki 内容分离 - 环境变量检查脚本
 *
 * 对应官方文档: docs/CONTENT_SEPARATION.md
 *   - 环境变量说明: ENABLE_CONTENT_SYNC / CONTENT_REPO_URL / CONTENT_DIR
 *   - 故障排查 问题4: ".env 文件不生效" -> 运行 pnpm run check-env
 *
 * 用法: pnpm run check-env
 * 退出码: 0 = 配置有效, 1 = 存在需修正的问题
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Mizuki 内容分离 - 环境变量检查\n");

const envPath = path.join(rootDir, ".env");

// --- 情况 1: 完全没有 .env 文件 ---
if (!fs.existsSync(envPath)) {
	console.log("• .env 文件: 不存在");
	console.log("  内容分离默认关闭 (使用本地内容,符合官方文档默认行为)。");
	console.log("  如需启用内容分离,请先创建配置:");
	console.log("    cp .env.example .env");
	console.log("  然后填写 ENABLE_CONTENT_SYNC=true 与 CONTENT_REPO_URL。\n");
	process.exit(0);
}

const raw = fs.readFileSync(envPath, "utf-8");

// --- 格式检查 (基于原始文本,对应文档 问题4 的 .env 不生效清单) ---
const formatWarnings = [];
raw.split("\n").forEach((line, idx) => {
	const l = line.trim();
	if (!l || l.startsWith("#")) return;
	// 等号两侧多余空格
	if (/^[^=\s]+(\s+)=(\s+)[^=]+$/.test(l)) {
		formatWarnings.push(`第 ${idx + 1} 行: 等号两侧有多余空格 -> "${l}"`);
	}
	// 值被引号包裹
	if (/^[^=]+=\s*["'].*["']\s*$/.test(l)) {
		formatWarnings.push(`第 ${idx + 1} 行: 值被引号包裹 -> "${l}"`);
	}
	// 缺少等号
	if (!l.includes("=")) {
		formatWarnings.push(`第 ${idx + 1} 行: 缺少等号 -> "${l}"`);
	}
});

// --- 加载环境变量 (供逻辑校验) ---
loadEnv();

const rawSync = process.env.ENABLE_CONTENT_SYNC;
const ENABLE_CONTENT_SYNC = rawSync === "true";
const CONTENT_REPO_URL = (process.env.CONTENT_REPO_URL || "").trim();
const CONTENT_DIR = (process.env.CONTENT_DIR || "./content").trim();

console.log("• .env 文件: 已找到\n");
console.log("配置项检查结果:");
console.log("--------------------------------------------------");

// ENABLE_CONTENT_SYNC
console.log(`ENABLE_CONTENT_SYNC = ${rawSync ?? "(未设置)"}`);
if (rawSync === undefined) {
	console.log("  ↳ 未设置,内容分离默认关闭 (符合官方文档默认行为)");
} else if (ENABLE_CONTENT_SYNC) {
	console.log("  ↳ 已启用内容分离");
} else {
	console.log("  ↳ 已禁用内容分离 (使用本地内容)");
}

// CONTENT_REPO_URL
console.log(`CONTENT_REPO_URL     = ${CONTENT_REPO_URL || "(未设置)"}`);
if (ENABLE_CONTENT_SYNC && !CONTENT_REPO_URL) {
	console.log("  ↳ ⚠️ 已启用内容分离但未设置仓库地址,同步将失败");
} else if (CONTENT_REPO_URL) {
	const isSSH = CONTENT_REPO_URL.startsWith("git@");
	const isToken = /^https?:\/\/[^@\s]+@/.test(CONTENT_REPO_URL);
	const mode = isSSH
		? "SSH 方式"
		: isToken
			? "HTTPS + Token 方式"
			: "HTTPS 方式 (公开仓库)";
	console.log(`  ↳ ${mode}`);
}

// CONTENT_DIR
const absDir = path.resolve(rootDir, CONTENT_DIR);
console.log(`CONTENT_DIR          = ${CONTENT_DIR}`);
console.log(`  ↳ 解析为: ${absDir}`);
console.log(`  ↳ 目录存在: ${fs.existsSync(absDir) ? "是" : "否"}`);
if (fs.existsSync(path.join(absDir, ".git"))) {
	console.log("  ↳ 检测到 .git,内容目录已是独立 Git 仓库 ✓");
}

console.log("--------------------------------------------------");

// --- 格式警告 ---
if (formatWarnings.length > 0) {
	console.log("\n⚠️ .env 格式提示:");
	formatWarnings.forEach((w) => console.log("  - " + w));
	console.log("  注: 当前解析器会自动去除空格与引号,但仍建议使用规范格式。");
}

// --- 结论 ---
let ok = true;
if (ENABLE_CONTENT_SYNC && !CONTENT_REPO_URL) ok = false;

console.log("");
if (ok) {
	if (ENABLE_CONTENT_SYNC) {
		console.log("✅ 内容分离配置正确,可运行 pnpm run sync-content 同步内容。");
	} else {
		console.log("✅ 配置有效:内容分离已关闭,将使用本地内容。");
	}
	process.exit(0);
} else {
	console.log("❌ 配置存在问题,请修正后再试 (参考 docs/CONTENT_SEPARATION.md 故障排查)。");
	process.exit(1);
}

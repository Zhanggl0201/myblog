/**
 * 批量图片转 WebP 脚本
 * 将 public/ 和 src/ 下的 png/jpg/jpeg/gif 图片转为 webp，并更新代码中的引用路径
 * 用法: node scripts/convert-to-webp.mjs
 */

import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname.replace(
	/^\/([A-Z]:)/,
	"$1",
);

// 需要排除的目录（看板娘贴图等不适合转换）
const EXCLUDE_DIRS = ["pio/models"];

// 需要扫描的目录
const SCAN_DIRS = ["public", "src"];

// 支持转换的扩展名
const CONVERTIBLE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif"]);

// 代码中需要更新引用的扩展名
const CODE_EXTS = new Set([
	".astro",
	".ts",
	".tsx",
	".js",
	".jsx",
	".svelte",
	".vue",
	".md",
	".mdx",
	".css",
	".html",
]);

async function* walkDir(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walkDir(fullPath);
		} else {
			yield fullPath;
		}
	}
}

function shouldExclude(filePath) {
	return EXCLUDE_DIRS.some(
		(d) =>
			filePath.includes(d.replace(/\//g, "\\")) || filePath.includes(d),
	);
}

async function convertImage(inputPath, outputPath) {
	try {
		await sharp(inputPath, { animated: extname(inputPath) === ".gif" })
			.webp({ quality: 80, effort: 4 })
			.toFile(outputPath);
		return true;
	} catch (err) {
		console.error(`  [ERROR] 转换失败: ${inputPath}`, err.message);
		return false;
	}
}

async function findImages() {
	const images = [];
	for (const scanDir of SCAN_DIRS) {
		const absDir = join(ROOT, scanDir);
		try {
			for await (const filePath of walkDir(absDir)) {
				const ext = extname(filePath).toLowerCase();
				if (CONVERTIBLE_EXTS.has(ext) && !shouldExclude(filePath)) {
					images.push(filePath);
				}
			}
		} catch {
			// 目录不存在则跳过
		}
	}
	return images;
}

async function findCodeFiles() {
	const files = [];
	for (const scanDir of SCAN_DIRS) {
		const absDir = join(ROOT, scanDir);
		try {
			for await (const filePath of walkDir(absDir)) {
				const ext = extname(filePath).toLowerCase();
				if (CODE_EXTS.has(ext)) {
					files.push(filePath);
				}
			}
		} catch {
			// 目录不存在则跳过
		}
	}
	return files;
}

async function updateReferences(convertedMap) {
	// convertedMap: 原始路径 → webp路径
	const codeFiles = await findCodeFiles();
	let totalReplacements = 0;

	for (const codeFile of codeFiles) {
		let content = await readFile(codeFile, "utf-8");
		let modified = false;

		for (const [origPath, webpPath] of convertedMap.entries()) {
			// 生成各种可能的引用形式
			const relOrig = relative(ROOT, origPath).replace(/\\/g, "/");
			const relWebp = relative(ROOT, webpPath).replace(/\\/g, "/");

			// 替换模式：匹配原始扩展名
			const patterns = [
				// 完整路径引用
				{ from: relOrig, to: relWebp },
				// public/ 开头的路径（在代码中通常省略 public 前缀）
				{
					from: relOrig.replace(/^public\//, "/"),
					to: relWebp.replace(/^public\//, "/"),
				},
				{
					from: relOrig.replace(/^public\//, ""),
					to: relWebp.replace(/^public\//, ""),
				},
			];

			for (const { from, to } of patterns) {
				if (from === to) continue;
				if (content.includes(from)) {
					content = content.split(from).join(to);
					modified = true;
					totalReplacements++;
				}
			}
		}

		if (modified) {
			await writeFile(codeFile, content, "utf-8");
			console.log(`  [UPDATE] ${relative(ROOT, codeFile)}`);
		}
	}

	return totalReplacements;
}

async function deleteOriginals(convertedMap) {
	for (const origPath of convertedMap.keys()) {
		try {
			await unlink(origPath);
			console.log(`  [DELETE] ${relative(ROOT, origPath)}`);
		} catch (err) {
			console.error(`  [ERROR] 删除失败: ${origPath}`, err.message);
		}
	}
}

async function main() {
	console.log("=== 图片转 WebP 工具 ===\n");

	// 1. 查找所有可转换的图片
	console.log("[1/4] 扫描图片文件...");
	const images = await findImages();
	console.log(`  找到 ${images.length} 张图片待转换\n`);

	if (images.length === 0) {
		console.log("没有需要转换的图片。");
		return;
	}

	// 2. 批量转换
	console.log("[2/4] 转换图片为 WebP...");
	const convertedMap = new Map();
	let successCount = 0;

	for (const imgPath of images) {
		const ext = extname(imgPath);
		const webpPath = imgPath.replace(new RegExp(`\\${ext}$`, "i"), ".webp");
		const relPath = relative(ROOT, imgPath);

		process.stdout.write(`  转换: ${relPath} ... `);
		const ok = await convertImage(imgPath, webpPath);
		if (ok) {
			convertedMap.set(imgPath, webpPath);
			successCount++;
			console.log("OK");
		}
	}

	console.log(`\n  成功转换: ${successCount}/${images.length}\n`);

	if (successCount === 0) {
		console.log("没有成功转换的图片，跳过后续步骤。");
		return;
	}

	// 3. 更新代码引用
	console.log("[3/4] 更新代码中的图片引用...");
	const replacements = await updateReferences(convertedMap);
	console.log(`  共更新 ${replacements} 处引用\n`);

	// 4. 删除原始文件
	console.log("[4/4] 删除原始图片文件...");
	await deleteOriginals(convertedMap);

	console.log("\n=== 转换完成 ===");
	console.log(`转换: ${successCount} 张 | 引用更新: ${replacements} 处`);
}

main().catch(console.error);

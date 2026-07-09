/**
 * galleryepic.xyz 崩坏：星穹铁道 Cosplay 图片下载脚本
 *
 * 从 galleryepic.xyz 抓取星穹铁道角色的 Cosplay 图片。
 * 该网站是 Next.js App Router (RSC) 应用，图片数据在 RSC payload 中。
 *
 * 图片 CDN:
 *   - static.galleryepic.xyz/image/UUID  (SSR 可获取，站点自有 CDN)
 *   - aka.doubaocdn.com/s/XXXX           (客户端动态加载，完整原图)
 *
 * 本脚本从 SSR HTML 的 RSC payload 中提取图片 UUID 列表，
 * 通过 static.galleryepic.xyz 下载图片。
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOAD_DIR = path.join(__dirname, "..", "downloads", "galleryepic");

const BASE_URL = "https://galleryepic.xyz";
const STATIC_CDN = "https://static.galleryepic.xyz/image";
const HSR_PARODY_ID = 13; // 崩坏：星穹铁道的 parody ID

// 星穹铁道角色 ID 列表
const HSR_CHARACTER_IDS = [
	747, // 知更鸟 Robin
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 带超时和重试的 fetch
 */
async function fetchWithRetry(url, options = {}, retries = 2) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 20000);

	try {
		const resp = await fetch(url, {
			...options,
			signal: controller.signal,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				...options.headers,
			},
		});
		clearTimeout(timeout);
		return resp;
	} catch (err) {
		clearTimeout(timeout);
		if (retries > 0) {
			console.warn(`  请求失败，重试中... (${url})`);
			await delay(1500);
			return fetchWithRetry(url, options, retries - 1);
		}
		throw err;
	}
}

/**
 * 从 RSC payload 中提取当前 cosplay 的图片 UUID 列表
 *
 * RSC payload 格式示例:
 *   self.__next_f.push([1,"1f:T751,[\"uuid1\",\"uuid2\",...]\n"])
 * 其中 T751 表示后面跟着 751 字节的文本数据
 */
function extractCosplayImageUuids(html) {
	const uuids = [];

	// 方法1: 从 RSC payload 中提取 UUID 数组
	// 匹配 "1f:T数字,[...]" 格式的 RSC payload
	const rscPattern = /self\.__next_f\.push\(\[1,"[0-9a-f]+:T\d+,(\[[\s\S]*?\])"\]\)/g;
	let match;
	while ((match = rscPattern.exec(html)) !== null) {
		try {
			const jsonStr = match[1]
				.replace(/\\"/g, '"')
				.replace(/\\n/g, "")
				.replace(/\\\\/g, "\\");
			const arr = JSON.parse(jsonStr);
			if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "string" && arr[0].length === 36 && arr[0].includes("-")) {
				uuids.push(...arr);
			}
		} catch {
			// 忽略解析失败
		}
	}

	// 方法2: 直接匹配 UUID 格式的图片路径
	if (uuids.length === 0) {
		const uuidPattern = /static\.galleryepic\.xyz\/image\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g;
		const seen = new Set();
		while ((match = uuidPattern.exec(html)) !== null) {
			if (!seen.has(match[1])) {
				seen.add(match[1]);
				uuids.push(match[1]);
			}
		}
	}

	return uuids;
}

/**
 * 从 HTML 中提取 cosplay 页面链接 ID
 */
function extractCosplayLinks(html) {
	const links = new Set();
	const regex = /\/en\/cosplay\/(\d+)/g;
	let match;
	while ((match = regex.exec(html)) !== null) {
		links.add(match[1]);
	}
	return [...links];
}

/**
 * 从 HTML 中提取角色页面链接 ID
 */
function extractCharacterLinks(html) {
	const links = new Set();
	const regex = /\/en\/character\/(\d+)/g;
	let match;
	while ((match = regex.exec(html)) !== null) {
		links.add(match[1]);
	}
	return [...links];
}

/**
 * 获取页面 HTML
 */
async function fetchPage(url) {
	try {
		console.log(`  请求: ${url}`);
		const resp = await fetchWithRetry(url);
		const html = await resp.text();
		console.log(`  响应: HTTP ${resp.status}, 长度: ${html.length} 字节`);
		return html;
	} catch (err) {
		console.log(`  ❌ 请求失败: ${err.message}`);
		return null;
	}
}

/**
 * 获取星穹铁道所有角色 ID
 */
async function getCharacterIds() {
	console.log("\n📋 获取星穹铁道角色列表...");
	const html = await fetchPage(`${BASE_URL}/en/parody/${HSR_PARODY_ID}`);
	if (!html) return HSR_CHARACTER_IDS;

	const charLinks = extractCharacterLinks(html);
	if (charLinks.length > 0) {
		console.log(`  找到 ${charLinks.length} 个角色: ${charLinks.join(", ")}`);
		return charLinks;
	}

	console.log("  未找到角色链接，使用默认列表");
	return HSR_CHARACTER_IDS;
}

/**
 * 获取角色页面的所有 Cosplay 链接
 */
async function getCosplayLinksForCharacter(charId) {
	const html = await fetchPage(`${BASE_URL}/en/character/${charId}`);
	if (!html) return [];

	const cosplayLinks = extractCosplayLinks(html);
	if (cosplayLinks.length > 0) {
		console.log(`  找到 ${cosplayLinks.length} 个 Cosplay 链接`);
	}

	return cosplayLinks;
}

/**
 * 获取 Cosplay 页面的图片 UUID 列表
 */
async function getCosplayImages(cosplayId) {
	const html = await fetchPage(`${BASE_URL}/en/cosplay/${cosplayId}`);
	if (!html) return [];

	const uuids = extractCosplayImageUuids(html);
	if (uuids.length > 0) {
		console.log(`  🖼️ Cosplay #${cosplayId}: 找到 ${uuids.length} 张图片`);
	} else {
		console.log(`  Cosplay #${cosplayId}: 未找到图片 UUID`);
	}

	return uuids;
}

/**
 * 下载单张图片
 */
async function downloadImage(uuid, destPath) {
	const url = `${STATIC_CDN}/${uuid}`;
	try {
		const resp = await fetchWithRetry(url, {}, 1);
		if (!resp.ok) {
			console.warn(`  ⚠️ 下载失败 ${url}: HTTP ${resp.status}`);
			return false;
		}

		const contentType = resp.headers.get("content-type") || "";
		const buffer = Buffer.from(await resp.arrayBuffer());

		let ext = ".jpg";
		if (contentType.includes("png")) ext = ".png";
		else if (contentType.includes("webp")) ext = ".webp";
		else if (contentType.includes("gif")) ext = ".gif";

		const finalPath = destPath + ext;
		await fs.writeFile(finalPath, buffer);
		console.log(
			`  ✅ 已保存: ${path.basename(finalPath)} (${(buffer.length / 1024).toFixed(1)} KB)`,
		);
		return true;
	} catch (err) {
		console.warn(`  ❌ 下载失败 ${url}: ${err.message}`);
		return false;
	}
}

/**
 * 下载一个 Cosplay 的所有图片
 */
async function downloadCosplay(cosplayId, uuids) {
	if (uuids.length === 0) return 0;

	const targetDir = path.join(DOWNLOAD_DIR, `cosplay-${cosplayId}`);
	console.log(`\n📥 下载 Cosplay #${cosplayId} (${uuids.length} 张图片) 到 ${targetDir}...`);
	await fs.mkdir(targetDir, { recursive: true });

	let successCount = 0;
	for (let i = 0; i < uuids.length; i++) {
		const fileName = `${String(i + 1).padStart(3, "0")}-${uuids[i]}`;
		const destPath = path.join(targetDir, fileName);
		const success = await downloadImage(uuids[i], destPath);
		if (success) successCount++;
		await delay(200);
	}

	console.log(`  📊 Cosplay #${cosplayId}: ${successCount}/${uuids.length} 成功`);
	return successCount;
}

/**
 * 输出手动操作指引
 */
function printManualInstructions() {
	console.log(`
╔══════════════════════════════════════════════════════════════════╗
║          ⚠️  自动抓取失败 - 手动操作指引  ⚠️                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  如果脚本未能提取到图片 URL，请尝试以下方法：                    ║
║                                                                  ║
║  方法一：使用浏览器开发者工具                                    ║
║  ────────────────────────────────                                ║
║  1. 在浏览器中打开 https://galleryepic.xyz/en/parody/13         ║
║  2. 按 F12 打开开发者工具                                       ║
║  3. 切换到 Network 标签页，筛选 "Img" 类型请求                  ║
║  4. 浏览页面，找到 aka.doubaocdn.com 的图片请求（完整原图）     ║
║  5. 右键复制图片 URL，用下载工具批量下载                        ║
║                                                                  ║
║  方法二：使用浏览器扩展                                          ║
║  ────────────────────────                                        ║
║  安装图片批量下载扩展（如 Image Downloader、Fatkun 等）          ║
║  访问角色页面后一键下载所有图片                                  ║
║                                                                  ║
║  方法三：使用 Puppeteer/Playwright                               ║
║  ──────────────────────────────                                  ║
║  npm install puppeteer                                           ║
║  然后用 headless 浏览器渲染页面并提取 aka.doubaocdn.com 图片     ║
║                                                                  ║
║  方法四：从下载页面获取 TeraBox/Baidu 链接                      ║
║  ──────────────────────────────────────                          ║
║  1. 访问 https://galleryepic.xyz/en/download/cosplay/XXXX       ║
║  2. 获取 TeraBox 或百度网盘链接                                 ║
║  3. 从网盘下载完整图片包                                        ║
║                                                                  ║
║  注意：                                                          ║
║  • static.galleryepic.xyz 图片是站点 CDN 版本（可能有压缩）     ║
║  • aka.doubaocdn.com 图片是完整原图（需要浏览器渲染才能获取）   ║
║                                                                  ║
║  常用页面链接:                                                   ║
║  • 星穹铁道列表: https://galleryepic.xyz/en/parody/13           ║
║  • 知更鸟角色: https://galleryepic.xyz/en/character/747         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// ===== 主流程 =====
async function main() {
	console.log("🚀 galleryepic.xyz 星穹铁道 Cosplay 图片下载器");
	console.log("=".repeat(50));
	console.log(`📁 下载目录: ${DOWNLOAD_DIR}`);
	console.log(`🌐 图片 CDN: ${STATIC_CDN}`);
	console.log("💡 提示: 下载的是站点 CDN 版本图片，完整原图需浏览器访问 aka.doubaocdn.com");

	// 第一步：获取角色列表
	const characterIds = await getCharacterIds();

	// 第二步：遍历角色，获取 Cosplay 链接
	console.log("\n👤 获取角色 Cosplay 列表...");
	const allCosplayIds = [];

	for (const charId of characterIds) {
		const cosplayLinks = await getCosplayLinksForCharacter(charId);
		cosplayLinks.forEach((id) => {
			if (!allCosplayIds.includes(id)) {
				allCosplayIds.push(id);
			}
		});
		await delay(500);
	}

	console.log(`\n📋 共找到 ${allCosplayIds.length} 个 Cosplay 页面`);

	if (allCosplayIds.length === 0) {
		console.log("\n❌ 未找到任何 Cosplay 页面");
		printManualInstructions();
		return;
	}

	// 第三步：逐个获取 Cosplay 页面的图片 UUID
	console.log("\n🎭 获取 Cosplay 页面图片...");
	const cosplayData = new Map(); // cosplayId -> [uuids]
	const cosplayToProcess = allCosplayIds.slice(0, 20); // 限制最多处理 20 个
	console.log(`  将处理前 ${cosplayToProcess.length} 个 Cosplay 页面`);

	for (const cosplayId of cosplayToProcess) {
		const uuids = await getCosplayImages(cosplayId);
		if (uuids.length > 0) {
			cosplayData.set(cosplayId, uuids);
		}
		await delay(500);
	}

	// 第四步：下载图片
	if (cosplayData.size === 0) {
		console.log("\n❌ 未能提取到任何图片");
		printManualInstructions();
		return;
	}

	let totalImages = 0;
	let totalSuccess = 0;

	await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

	for (const [cosplayId, uuids] of cosplayData) {
		totalImages += uuids.length;
		const success = await downloadCosplay(cosplayId, uuids);
		totalSuccess += success;
	}

	console.log(`\n🎉 全部完成！`);
	console.log(`📊 共处理 ${cosplayData.size} 个 Cosplay，${totalImages} 张图片`);
	console.log(`✅ 成功下载 ${totalSuccess} 张`);
	console.log(`📁 保存位置: ${DOWNLOAD_DIR}`);

	if (totalSuccess < totalImages) {
		console.log(`⚠️ ${totalImages - totalSuccess} 张图片下载失败`);
	}
}

main().catch((err) => {
	console.error("💥 脚本执行出错:", err);
	printManualInstructions();
	process.exit(1);
});

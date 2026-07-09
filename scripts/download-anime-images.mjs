/**
 * 多站点动漫/游戏图片批量下载脚本
 *
 * 支持的站点:
 *   - Gelbooru (gelbooru.com)
 *   - Safebooru (safebooru.org)
 *   - Wallhaven (wallhaven.cc) — 可选，需要 API key
 *
 * 搜索标签: honkai_star_rail, genshin_impact, blue_archive
 * 下载目录: downloads/anime-images/{site}/{tag}/
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOAD_BASE = path.join(__dirname, "..", "downloads", "anime-images");

const DELAY_MS = 500;
const MAX_PAGES_PER_TAG = 3;
const PER_PAGE = 100;
const DOWNLOAD_TIMEOUT_MS = 15_000;

const TAGS = ["honkai_star_rail", "genshin_impact", "blue_archive"];
const WALLHAVEN_KEYWORDS = ["honkai star rail", "genshin impact", "blue archive"];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── 工具函数 ────────────────────────────────────────────

async function fetchJSON(url, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "application/json,*/*",
      },
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

function getExtFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].includes(ext)) {
      return ext.replace(".jpeg", ".jpg");
    }
  } catch {}
  return ".jpg";
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadFile(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    await fs.writeFile(destPath, buffer);
    return true;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ─── Gelbooru ────────────────────────────────────────────

async function fetchGelbooruPosts(tag, page) {
  const url =
    `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1` +
    `&tags=${encodeURIComponent(tag)}&limit=${PER_PAGE}&pid=${page}`;
  const data = await fetchJSON(url);
  return data.post || [];
}

// ─── Safebooru ───────────────────────────────────────────

async function fetchSafebooruPosts(tag, page) {
  const url =
    `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1` +
    `&tags=${encodeURIComponent(tag)}&limit=${PER_PAGE}&pid=${page}`;
  const data = await fetchJSON(url);
  return data.post || data || [];
}

// ─── Wallhaven ───────────────────────────────────────────

async function fetchWallhavenPosts(keyword, page, apiKey) {
  let url =
    `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(keyword)}` +
    `&categories=010&purity=100&sorting=relevance&page=${page}`;
  if (apiKey) url += `&apikey=${apiKey}`;
  const data = await fetchJSON(url);
  return data.data || [];
}

// ─── 下载一个站点的某个标签 ──────────────────────────────

async function downloadSiteTag(siteName, tag, fetchPostsFn) {
  const tagDir = path.join(DOWNLOAD_BASE, siteName, tag);
  await fs.mkdir(tagDir, { recursive: true });

  let found = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let page = 0; page < MAX_PAGES_PER_TAG; page++) {
    let posts;
    try {
      posts = await fetchPostsFn(tag, page);
    } catch (err) {
      console.warn(`  [${siteName}/${tag}] 第 ${page} 页请求失败: ${err.message}`);
      break;
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      console.log(`  [${siteName}/${tag}] 第 ${page} 页无数据，停止翻页`);
      break;
    }

    found += posts.length;
    console.log(`  [${siteName}/${tag}] 第 ${page} 页: 找到 ${posts.length} 张`);

    for (const post of posts) {
      const id = post.id;
      const imageUrl = post.file_url || post.path || post.sample_url;
      if (!id || !imageUrl) {
        skipped++;
        continue;
      }

      const ext = getExtFromUrl(imageUrl);
      const fileName = `${id}${ext}`;
      const filePath = path.join(tagDir, fileName);

      if (await fileExists(filePath)) {
        skipped++;
        continue;
      }

      try {
        await downloadFile(imageUrl, filePath);
        downloaded++;
        if (downloaded % 20 === 0) {
          console.log(`  [${siteName}/${tag}] 已下载 ${downloaded} 张...`);
        }
      } catch (err) {
        failed++;
        if (failed <= 3) {
          console.warn(`  [${siteName}/${tag}] 下载失败 #${id}: ${err.message}`);
        }
      }

      await delay(DELAY_MS);
    }
  }

  return { found, downloaded, skipped, failed };
}

// ─── Wallhaven 下载 ──────────────────────────────────────

async function downloadWallhavenTag(keyword, apiKey) {
  const siteName = "wallhaven";
  const tagDir = path.join(DOWNLOAD_BASE, siteName, keyword.replace(/ /g, "_"));
  await fs.mkdir(tagDir, { recursive: true });

  let found = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let page = 1; page <= MAX_PAGES_PER_TAG; page++) {
    let posts;
    try {
      posts = await fetchWallhavenPosts(keyword, page, apiKey);
    } catch (err) {
      console.warn(`  [wallhaven/${keyword}] 第 ${page} 页请求失败: ${err.message}`);
      break;
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      console.log(`  [wallhaven/${keyword}] 第 ${page} 页无数据，停止翻页`);
      break;
    }

    found += posts.length;
    console.log(`  [wallhaven/${keyword}] 第 ${page} 页: 找到 ${posts.length} 张`);

    for (const post of posts) {
      const id = post.id;
      const imageUrl = post.path;
      if (!id || !imageUrl) {
        skipped++;
        continue;
      }

      const ext = getExtFromUrl(imageUrl);
      const fileName = `${id}${ext}`;
      const filePath = path.join(tagDir, fileName);

      if (await fileExists(filePath)) {
        skipped++;
        continue;
      }

      try {
        await downloadFile(imageUrl, filePath);
        downloaded++;
        if (downloaded % 10 === 0) {
          console.log(`  [wallhaven/${keyword}] 已下载 ${downloaded} 张...`);
        }
      } catch (err) {
        failed++;
        if (failed <= 3) {
          console.warn(`  [wallhaven/${keyword}] 下载失败 #${id}: ${err.message}`);
        }
      }

      await delay(DELAY_MS);
    }
  }

  return { found, downloaded, skipped, failed };
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  console.log("🚀 动漫/游戏图片批量下载器");
  console.log("=".repeat(55));
  console.log(`📁 下载目录: ${DOWNLOAD_BASE}`);
  console.log(`🏷️  标签: ${TAGS.join(", ")}`);
  console.log(`📄 每标签最多 ${MAX_PAGES_PER_TAG} 页 (每页 ${PER_PAGE} 张)`);
  console.log(`⏱️  请求间隔: ${DELAY_MS}ms`);
  console.log();

  const results = {};
  let totalFound = 0;
  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // ── Gelbooru ──
  console.log("━━━ Gelbooru ━━━");
  results.gelbooru = { found: 0, downloaded: 0, skipped: 0, failed: 0 };
  for (const tag of TAGS) {
    try {
      const r = await downloadSiteTag("gelbooru", tag, fetchGelbooruPosts);
      results.gelbooru.found += r.found;
      results.gelbooru.downloaded += r.downloaded;
      results.gelbooru.skipped += r.skipped;
      results.gelbooru.failed += r.failed;
    } catch (err) {
      console.warn(`  Gelbooru 标签 ${tag} 整体失败: ${err.message}`);
    }
  }
  console.log(
    `  📊 Gelbooru 小计: 发现 ${results.gelbooru.found}, 下载 ${results.gelbooru.downloaded}, 跳过 ${results.gelbooru.skipped}, 失败 ${results.gelbooru.failed}`,
  );
  console.log();

  // ── Safebooru ──
  console.log("━━━ Safebooru ━━━");
  results.safebooru = { found: 0, downloaded: 0, skipped: 0, failed: 0 };
  for (const tag of TAGS) {
    try {
      const r = await downloadSiteTag("safebooru", tag, fetchSafebooruPosts);
      results.safebooru.found += r.found;
      results.safebooru.downloaded += r.downloaded;
      results.safebooru.skipped += r.skipped;
      results.safebooru.failed += r.failed;
    } catch (err) {
      console.warn(`  Safebooru 标签 ${tag} 整体失败: ${err.message}`);
    }
  }
  console.log(
    `  📊 Safebooru 小计: 发现 ${results.safebooru.found}, 下载 ${results.safebooru.downloaded}, 跳过 ${results.safebooru.skipped}, 失败 ${results.safebooru.failed}`,
  );
  console.log();

  // ── Wallhaven (可选) ──
  console.log("━━━ Wallhaven ━━━");
  const wallhavenApiKey = process.env.WALLHAVEN_API_KEY || "";
  results.wallhaven = { found: 0, downloaded: 0, skipped: 0, failed: 0 };

  try {
    // 先测试一次请求
    const testUrl = `https://wallhaven.cc/api/v1/search?q=test&categories=010&purity=100&page=1`;
    const testResp = await fetch(testUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    });
    if (!testResp.ok) {
      throw new Error(`测试请求返回 HTTP ${testResp.status}`);
    }

    for (const keyword of WALLHAVEN_KEYWORDS) {
      try {
        const r = await downloadWallhavenTag(keyword, wallhavenApiKey);
        results.wallhaven.found += r.found;
        results.wallhaven.downloaded += r.downloaded;
        results.wallhaven.skipped += r.skipped;
        results.wallhaven.failed += r.failed;
      } catch (err) {
        console.warn(`  Wallhaven 关键词 ${keyword} 失败: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`  ⚠️ Wallhaven 不可用，跳过: ${err.message}`);
  }
  console.log(
    `  📊 Wallhaven 小计: 发现 ${results.wallhaven.found}, 下载 ${results.wallhaven.downloaded}, 跳过 ${results.wallhaven.skipped}, 失败 ${results.wallhaven.failed}`,
  );
  console.log();

  // ── 汇总 ──
  for (const site of Object.keys(results)) {
    totalFound += results[site].found;
    totalDownloaded += results[site].downloaded;
    totalSkipped += results[site].skipped;
    totalFailed += results[site].failed;
  }

  console.log("=".repeat(55));
  console.log("🎉 下载完成！汇总统计:");
  console.log(`   发现: ${totalFound} 张`);
  console.log(`   下载: ${totalDownloaded} 张`);
  console.log(`   跳过: ${totalSkipped} 张 (已存在或缺少URL)`);
  console.log(`   失败: ${totalFailed} 张`);
  console.log();
  console.log("各站点详情:");
  for (const [site, r] of Object.entries(results)) {
    console.log(`  ${site}: 发现 ${r.found}, 下载 ${r.downloaded}, 跳过 ${r.skipped}, 失败 ${r.failed}`);
  }
  console.log();
  console.log(`📁 保存位置: ${DOWNLOAD_BASE}`);
}

main().catch((err) => {
  console.error("💥 脚本执行出错:", err);
  process.exit(1);
});

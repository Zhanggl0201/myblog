#!/usr/bin/env node
/**
 * 图片批量转换工具
 * 用法: node img-converter.mjs <输入目录> <输出目录> [选项]
 * 
 * 选项:
 *   --format <webp|png|jpg|avif>   输出格式 (默认: webp)
 *   --quality <1-100>              输出质量 (默认: 80)
 *   --concurrency <1-50>           并发数 (默认: 10)
 *   --rename                       按序号重命名 (001.webp, 002.webp...)
 *   --delete-original              转换后删除原文件
 * 
 * 示例:
 *   node img-converter.mjs ./input ./output
 *   node img-converter.mjs ./input ./output --format webp --quality 85
 *   node img-converter.mjs ./input ./output --rename --delete-original
 *   node img-converter.mjs ./input ./output --format avif --quality 70 --concurrency 5
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

function showHelp() {
    console.log(`
图片批量转换工具
用法: node img-converter.mjs <输入目录> <输出目录> [选项]

选项:
  --format <webp|png|jpg|avif>   输出格式 (默认: webp)
  --quality <1-100>              输出质量 (默认: 80)
  --concurrency <1-50>           并发数 (默认: 10)
  --rename                       按序号重命名 (001.webp, 002.webp...)
  --delete-original              转换后删除原文件
  --help                         显示帮助

示例:
  node img-converter.mjs ./input ./output
  node img-converter.mjs ./input ./output --format webp --quality 85
  node img-converter.mjs ./input ./output --rename --delete-original
  node img-converter.mjs ./input ./output --format avif --quality 70 --concurrency 5
`);
}

if (args.includes('--help') || args.length < 2) {
    showHelp();
    process.exit(0);
}

const inputDir = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);

const formatIdx = args.indexOf('--format');
const format = formatIdx !== -1 ? args[formatIdx + 1] : 'webp';

const qualityIdx = args.indexOf('--quality');
const quality = qualityIdx !== -1 ? parseInt(args[qualityIdx + 1]) : 80;

const concurrencyIdx = args.indexOf('--concurrency');
const concurrency = concurrencyIdx !== -1 ? parseInt(args[concurrencyIdx + 1]) : 10;

const doRename = args.includes('--rename');
const deleteOriginal = args.includes('--delete-original');

if (!fs.existsSync(inputDir)) {
    console.error('输入目录不存在: ' + inputDir);
    process.exit(1);
}

const validFormats = ['webp', 'png', 'jpg', 'avif'];
if (!validFormats.includes(format)) {
    console.error('不支持的格式: ' + format + '，可选: ' + validFormats.join(', '));
    process.exit(1);
}

const inputExts = /\.(png|jpg|jpeg|webp|avif|bmp|tiff|gif)$/i;

function collectFiles(dir, base = '') {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = base ? base + '/' + entry.name : entry.name;
        if (entry.isDirectory()) {
            results = results.concat(collectFiles(fullPath, relPath));
        } else if (inputExts.test(entry.name)) {
            results.push({ fullPath, relPath, name: entry.name });
        }
    }
    return results;
}

const files = collectFiles(inputDir);
console.log('找到 ' + files.length + ' 张图片');
console.log('输出格式: ' + format + ' | 质量: ' + quality + ' | 并发: ' + concurrency);
if (doRename) console.log('启用序号重命名');
if (deleteOriginal) console.log('启用删除原文件');
console.log('');

let done = 0;
let failed = 0;

async function convertFile(file, index) {
    const outRelDir = path.dirname(file.relPath);
    const outDir = path.join(outputDir, outRelDir);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    let outName;
    if (doRename) {
        const padLen = Math.max(3, String(files.length).length);
        outName = String(index + 1).padStart(padLen, '0') + '.' + format;
    } else {
        outName = file.name.replace(inputExts, '.' + format);
    }

    const outPath = path.join(outDir, outName);

    try {
        let pipeline = sharp(file.fullPath, { animated: false });
        switch (format) {
            case 'webp': pipeline = pipeline.webp({ quality }); break;
            case 'png': pipeline = pipeline.png({ quality }); break;
            case 'jpg': pipeline = pipeline.jpeg({ quality }); break;
            case 'avif': pipeline = pipeline.avif({ quality }); break;
        }
        await pipeline.toFile(outPath);

        if (deleteOriginal) {
            fs.unlinkSync(file.fullPath);
        }

        done++;
        if (done % 50 === 0 || done === files.length) {
            console.log(done + '/' + files.length + ' converted');
        }
    } catch (e) {
        failed++;
        console.error('FAIL: ' + file.relPath + ' - ' + e.message);
        done++;
    }
}

async function processBatch() {
    let index = 0;
    async function worker() {
        while (index < files.length) {
            const i = index++;
            await convertFile(files[i], i);
        }
    }
    const workers = [];
    const c = Math.min(concurrency, files.length);
    for (let i = 0; i < c; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);
    console.log('\n完成! ' + (files.length - failed) + ' 转换成功, ' + failed + ' 失败');
    if (deleteOriginal && failed === 0) {
        console.log('原文件已删除');
    }
}

processBatch();

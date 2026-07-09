import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const origBase = 'C:\\Users\\sherry\\Desktop\\Mizuki\\downloads\\HonkaiStarRail-original';
const webpBase = 'C:\\Users\\sherry\\Desktop\\Mizuki\\downloads\\HonkaiStarRail';

const dirs = fs.readdirSync(origBase);
let total = 0;
let done = 0;
let failed = 0;

const tasks = [];

dirs.forEach(d => {
    const srcDir = path.join(origBase, d);
    const dstDir = path.join(webpBase, d);
    if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    total += files.length;

    files.forEach(f => {
        const src = path.join(srcDir, f);
        const dst = path.join(dstDir, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
        tasks.push({ src, dst, name: f });
    });
});

console.log('Converting ' + total + ' images...');

async function processBatch(tasks, concurrency = 10) {
    let index = 0;
    async function worker() {
        while (index < tasks.length) {
            const task = tasks[index++];
            try {
                await sharp(task.src, { animated: false }).webp({ quality: 80 }).toFile(task.dst);
                done++;
                if (done % 50 === 0 || done === total) {
                    console.log(done + '/' + total + ' converted');
                }
            } catch (e) {
                failed++;
                console.error('FAIL: ' + task.name + ' - ' + e.message);
                done++;
            }
        }
    }
    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);
    console.log('Done! ' + (total - failed) + ' converted, ' + failed + ' failed');
}

processBatch(tasks);

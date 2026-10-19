const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const PORT = 3337; // Running on 3337 to avoid conflicts

let extractionState = {
    isRunning: false,
    allTextures: [],
    logs: [],
    progress: 0
};

let clients = [];
const uniqueTextures = new Map();

function broadcast(event, data) {
    clients.forEach(client => {
        client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
}

function logToDashboard(message) {
    console.log(message);
    extractionState.logs.push(message);
    broadcast('log', message);
}

// Helper to clean HTML text
function cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').replace(/&#34;/g, '"').replace(/&nbsp;/g, ' ').trim();
}

async function startExtraction() {
    if (extractionState.isRunning) return;
    extractionState.isRunning = true;
    extractionState.allTextures = [];
    extractionState.logs = [];
    extractionState.progress = 0;
    uniqueTextures.clear();

    logToDashboard("🚀 Starting Birla Opus Texture Crawler...");

    try {
        logToDashboard(`\n🔍 Fetching main Birla Opus texture catalog...`);
        // 1. Hit the main textures page to gather all individual pattern links
        const baseUrl = 'https://www.birlaopus.com';
        const { data: mainHtml } = await axios.get(`${baseUrl}/texture`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $main = cheerio.load(mainHtml);
        const patternLinks = new Set();

        // Extract all links pointing to interior textures
        $main('a').each((i, el) => {
            const href = $main(el).attr('href');
            if (href && href.includes('/interior-texture/') && !href.includes('.html')) {
                patternLinks.add(href);
            }
        });

        const linksArray = Array.from(patternLinks);
        logToDashboard(`✅ Found ${linksArray.length} texture pattern pages to crawl.`);
        broadcast('state', { progress: 10, isRunning: true });

        let count = 0;
        const progressIncrement = 80 / (linksArray.length || 1);

        // 2. Loop through every single pattern page and extract the exact DOM structure you found
        for (let i = 0; i < linksArray.length; i++) {
            const link = linksArray[i];
            const fullUrl = link.startsWith('http') ? link : `${baseUrl}${link}`;
            
            try {
                logToDashboard(`📥 Crawling: ${fullUrl}`);
                const { data: pageHtml } = await axios.get(fullUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });

                const $ = cheerio.load(pageHtml);

                // Target the exact tags from your screenshot
                const rawName = $('.cmp-texture__content-title').text();
                const rawFamily = $('.cmp-texture__content-title').attr('data-inspiration') || 'Textures';
                const rawDesc = $('.cmp-texture__content-description').text();
                
                const cleanName = cleanText(rawName);
                const finalDesc = cleanText(rawDesc);
                const finalFamily = cleanText(rawFamily);

                if (cleanName) {
                    // Loop through all color combinations for this pattern
                    $('.cmp-texture__other-combination-image').each((index, el) => {
                        const targetId = $(el).attr('data-target'); // e.g., 'mushroom1'
                        const imgUrl = $(el).find('img').attr('src');
                        
                        if (targetId && imgUrl) {
                            let fullImageUrl = imgUrl;
                            if (!imgUrl.startsWith('http')) {
                                fullImageUrl = `https://assets.birlaopus.com${imgUrl}`;
                            }

                            // We use targetId (e.g., mushroom1) as the unique code to prevent duplicates
                            const code = targetId.trim();

                            if (!uniqueTextures.has(code)) {
                                const newTexture = {
                                    brand: 'Birla Opus',
                                    name: cleanName,
                                    code: code,
                                    image: fullImageUrl,
                                    family: finalFamily,
                                    description: finalDesc
                                };
                                
                                uniqueTextures.set(code, newTexture);
                                extractionState.allTextures.push(newTexture);
                                count++;
                                
                                broadcast('texture', newTexture);
                            }
                        }
                    });
                }
            } catch (err) {
                logToDashboard(`⚠️ Failed to scrape ${link}: ${err.message}`);
            }

            extractionState.progress = 10 + (progressIncrement * (i + 1));
            broadcast('state', { progress: extractionState.progress, isRunning: true });
        }

        logToDashboard(`✅ Successfully extracted ${count} total Birla Opus combinations!`);

    } catch (error) {
        logToDashboard(`⚠️ Master Crawler Error: ${error.message}`);
    }

    extractionState.progress = 100;
    extractionState.isRunning = false;
    broadcast('state', extractionState);

    const fileName = 'birla-opus-textures.json';
    fs.writeFileSync(fileName, JSON.stringify(extractionState.allTextures, null, 2));
    logToDashboard(`\n🎉 Extraction Complete! Saved ${extractionState.allTextures.length} textures to ${fileName}.`);
}

// Visual Dashboard Server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Birla Opus Crawler</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-6xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Birla Opus Texture Crawler</h1>
                            <p class="text-zinc-400">Scraping pages recursively for patterns and combinations</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Crawler
                        </button>
                    </header>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[600px]">
                            <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex justify-between">
                                System Logs <span id="statusIndicator" class="w-2 h-2 rounded-full bg-zinc-600 mt-1"></span>
                            </h2>
                            <div id="logs" class="flex-1 overflow-y-auto font-mono text-xs text-zinc-400 space-y-2 pb-2">
                                <div>System ready. Waiting to start...</div>
                            </div>
                        </div>

                        <div class="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[600px]">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Live Texture Previews</h2>
                                <div class="text-sm font-mono bg-zinc-800 px-3 py-1 rounded-full"><span id="count" class="text-white font-bold">0</span> Total Combinations</div>
                            </div>
                            
                            <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden">
                                <div id="progressBar" class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                            </div>

                            <div id="swatchGrid" class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-2 content-start">
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    const logsEl = document.getElementById('logs');
                    const gridEl = document.getElementById('swatchGrid');
                    const countEl = document.getElementById('count');
                    const btn = document.getElementById('startBtn');
                    const progress = document.getElementById('progressBar');
                    const status = document.getElementById('statusIndicator');

                    btn.addEventListener('click', async () => {
                        btn.innerText = 'Crawling pages...';
                        btn.disabled = true;
                        btn.classList.add('opacity-50');
                        status.classList.replace('bg-zinc-600', 'bg-green-500');
                        status.classList.add('animate-pulse');
                        logsEl.innerHTML = '';
                        gridEl.innerHTML = '';
                        countEl.innerText = '0';
                        
                        await fetch('/trigger-start', { method: 'POST' });
                    });

                    const evtSource = new EventSource('/stream');
                    
                    evtSource.addEventListener('log', (e) => {
                        const div = document.createElement('div');
                        div.innerText = e.data.replace(/['"]/g, '');
                        if(e.data.includes('⚠️')) div.className = "text-yellow-400";
                        if(e.data.includes('✅') || e.data.includes('📥')) div.className = "text-green-400";
                        if(e.data.includes('🎉')) div.className = "text-indigo-400 font-bold text-sm mt-4";
                        logsEl.appendChild(div);
                        logsEl.scrollTop = logsEl.scrollHeight;
                    });

                    let total = 0;
                    evtSource.addEventListener('texture', (e) => {
                        const texture = JSON.parse(e.data);
                        total++;
                        countEl.innerText = total;

                        const card = document.createElement('div');
                        card.className = "bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 shadow-sm animate-in fade-in zoom-in duration-300 flex flex-col";
                        card.innerHTML = \`
                            <div class="h-28 w-full bg-zinc-900 relative shrink-0">
                                <img src="\${texture.image}" class="w-full h-full object-cover" />
                            </div>
                            <div class="p-3 flex flex-col flex-1">
                                <p class="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">\${texture.code}</p>
                                <p class="text-xs font-semibold text-white truncate leading-tight mb-1">\${texture.name}</p>
                            </div>
                        \`;
                        gridEl.prepend(card);
                    });

                    evtSource.addEventListener('state', (e) => {
                        const state = JSON.parse(e.data);
                        progress.style.width = state.progress + '%';
                        
                        if(state.progress === 100 && !state.isRunning) {
                            btn.innerText = 'Extraction Complete';
                            status.classList.replace('bg-green-500', 'bg-indigo-500');
                            status.classList.remove('animate-pulse');
                        }
                    });
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/trigger-start' && req.method === 'POST') {
        startExtraction();
        res.writeHead(200);
        res.end();
    } else if (req.url === '/stream') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        clients.push(res);
        req.on('close', () => { clients = clients.filter(c => c !== res); });
    }
});

server.listen(PORT, () => {
    console.clear();
    console.log("==========================================");
    console.log("🏗️ BIRLA OPUS TEXTURE CRAWLER IS READY!");
    console.log("==========================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
});
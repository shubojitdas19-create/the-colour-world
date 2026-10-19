const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const PORT = 3336;

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

async function startExtraction() {
    if (extractionState.isRunning) return;
    extractionState.isRunning = true;
    extractionState.allTextures = [];
    extractionState.logs = [];
    extractionState.progress = 0;
    uniqueTextures.clear();

    logToDashboard("🚀 Starting Asian Paints Texture Auto-Extractor...");

    try {
        logToDashboard(`\n🔍 Fetching master texture grid HTML...`);
        const url = 'https://www.asianpaints.com/interior-textures.html';
        
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        broadcast('state', { progress: 30, isRunning: true });
        logToDashboard(`✅ HTML loaded. Hunting for descriptions and master database...`);

        const $ = cheerio.load(html);
        
        // STEP 1: Memorize all descriptions from the DOM elements
        const descriptionsMap = new Map();
        $('[data-entityname]').each((i, el) => {
            const nameAttr = $(el).attr('data-entityname');
            let descAttr = $(el).attr('data-description');
            
            if (nameAttr) {
                const cleanName = nameAttr.replace(/&#34;/g, '"').trim();
                let cleanDesc = '';
                if (descAttr) {
                    cleanDesc = descAttr.replace(/&#34;/g, '"').trim();
                }
                descriptionsMap.set(cleanName, cleanDesc);
            }
        });
        
        // STEP 2: Extract the hidden master JSON database
        const rawData = $('#collectionListing').attr('data-attr-proddata');

        if (rawData) {
            logToDashboard(`✅ Found the hidden database! Merging descriptions with combinations...`);
            
            const cleanJsonString = rawData.replace(/&#34;/g, '"');
            const parsedData = JSON.parse(cleanJsonString);
            
            let allItems = [];
            if (parsedData.All) {
                allItems = parsedData.All;
            }

            let count = 0;
            broadcast('state', { progress: 60, isRunning: true });

            allItems.forEach(item => {
                const baseName = item.entityName;
                if (baseName) {
                    const cleanBaseName = baseName.trim();
                    
                    // Fetch the mapped description, use a dynamic fallback if empty
                    let finalDescription = descriptionsMap.get(cleanBaseName);
                    if (!finalDescription) {
                        finalDescription = "The " + cleanBaseName + " texture transforms your space with a premium designer finish. Created using specialized application tools and high-quality materials to ensure a stunning effect on your walls.";
                    }
                    
                    let codes = item.entityCodeList;
                    if (!codes) {
                        if (item.entityCode) {
                            codes = [item.entityCode];
                        } else {
                            codes = [];
                        }
                    }
                    if (codes.length === 0) {
                        if (item.entityCode) {
                            codes = [item.entityCode];
                        }
                    }
                    
                    let families = item.shadeFamilyList;
                    if (!families) {
                        if (item.shadeFamily) {
                            families = [item.shadeFamily];
                        } else {
                            families = [];
                        }
                    }
                    if (families.length === 0) {
                        if (item.shadeFamily) {
                            families = [item.shadeFamily];
                        }
                    }
                    
                    let roomShots = item.listingSwatchImageInfoList;
                    if (!roomShots) roomShots = [];
                    
                    let swatches = item.swatchImageInfoList;
                    if (!swatches) swatches = [];

                    for (let j = 0; j < codes.length; j++) {
                        const code = codes[j];
                        if (code) {
                            let family = families[j];
                            if (!family) family = item.shadeFamily;
                            if (!family) family = 'Textures';
                            
                            let imgObj = roomShots[j];
                            if (!imgObj) imgObj = swatches[j];
                            
                            let imgPath = null;
                            if (imgObj) {
                                if (imgObj.src) {
                                    imgPath = imgObj.src;
                                }
                            }
                            if (!imgPath) imgPath = item.listingSwatchImage;
                            if (!imgPath) imgPath = item.swatchImage;

                            if (imgPath) {
                                if (!uniqueTextures.has(code)) {
                                    let fullImageUrl = imgPath;
                                    if (!imgPath.startsWith('http')) {
                                        fullImageUrl = 'https://www.asianpaints.com' + imgPath;
                                    }

                                    const newTexture = {
                                        brand: 'Asian Paints',
                                        name: cleanBaseName,
                                        code: code.trim(),
                                        image: fullImageUrl,
                                        family: family.trim(),
                                        description: finalDescription // Injected the real description here
                                    };
                                    
                                    uniqueTextures.set(code, newTexture);
                                    extractionState.allTextures.push(newTexture);
                                    count++;
                                    
                                    broadcast('texture', newTexture);
                                }
                            }
                        }
                    }
                }
            });

            logToDashboard(`✅ Successfully extracted ${count} total texture combinations with descriptions!`);
        } else {
            logToDashboard(`⚠️ Error: Could not find the collectionListing div.`);
        }

    } catch (error) {
        logToDashboard(`⚠️ Extraction Error: ${error.message}`);
    }

    extractionState.progress = 100;
    extractionState.isRunning = false;
    broadcast('state', extractionState);

    const fileName = 'asian-paints-textures.json';
    fs.writeFileSync(fileName, JSON.stringify(extractionState.allTextures, null, 2));
    logToDashboard(`\n🎉 Extraction Complete! Saved ${extractionState.allTextures.length} total textures to ${fileName}.`);
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>The Colour World - Texture Extractor</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-6xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Asian Paints Texture Extractor</h1>
                            <p class="text-zinc-400">Extracting patterns, descriptions, and color combinations</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Texture Extraction
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
                        btn.innerText = 'Extracting...';
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
                        if(e.data.includes('✅')) div.className = "text-green-400";
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
                                <img src="\${texture.image}" class="w-full h-full object-cover" alt="Texture preview" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzZjNmNDYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2EwYTBhMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+'" />
                            </div>
                            <div class="p-3 flex flex-col flex-1">
                                <p class="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">\${texture.code}</p>
                                <p class="text-xs font-semibold text-white truncate leading-tight mb-1">\${texture.name}</p>
                                <p class="text-[9px] text-zinc-400 line-clamp-2 leading-tight">\${texture.description}</p>
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
    console.log("🎨 ASIAN PAINTS TEXTURE LIVE EXTRACTOR V4 READY!");
    console.log("==========================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
});
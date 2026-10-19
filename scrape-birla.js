const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const PORT = 3334;

// We start with the base ones, but we will auto-discover the rest!
let categories = [
    'yellow-wall-paint-colours',
    'red-wall-paint-colours',
    'blue-wall-paint-colours',
    'green-wall-paint-colours',
    'orange-wall-paint-colours',
    'purple-wall-paint-colours',
    'blue-green-wall-paint-colours',
    'yellow-green-wall-paint-colours'
];

let extractionState = {
    isRunning: false,
    allShades: [],
    logs: [],
    progress: 0
};

let clients = [];

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
    extractionState.allShades = [];
    extractionState.logs = [];
    extractionState.progress = 0;

    logToDashboard("🚀 Starting Birla Opus Full Catalog Extraction...");

    // STEP 1: AUTO-DISCOVER URLs
    logToDashboard("📡 Scanning main catalog to discover missing category URLs...");
    try {
        const { data: mainData } = await axios.get('https://www.birlaopus.com/colour-catalogue', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $main = cheerio.load(mainData);
        
        // Find all links on the main page that point to catalogue categories
        $main('a').each((i, el) => {
            const href = $main(el).attr('href');
            if (href && href.includes('/colour-catalogue/') && href.length > 20) {
                const slug = href.split('/').pop().replace('.html', '').trim();
                // Add new URLs to our list if they aren't already there
                if (!categories.includes(slug)) {
                    categories.push(slug);
                }
            }
        });
        
        // Add a few manual backups just in case the buttons use JS instead of hrefs
        const backups = ['whites-wall-paint-colours', 'neutrals-browns-and-greys-wall-paint-colours', 'india-iconic-wall-paint-colours'];
        backups.forEach(b => { if(!categories.includes(b)) categories.push(b); });

        logToDashboard(`✅ Discovery complete. Found ${categories.length} categories to scan.`);
    } catch(e) {
        logToDashboard("⚠️ Auto-discovery skipped, proceeding with hardcoded lists.");
    }

    // STEP 2: SCRAPE EVERY CATEGORY
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        extractionState.progress = Math.round((i / categories.length) * 100);
        broadcast('state', extractionState);
        
        logToDashboard(`\n🔍 Scanning Category: ${category}...`);
        const url = `https://www.birlaopus.com/colour-catalogue/${category}`;
        
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'
                }
            });
            
            const $ = cheerio.load(data);
            let foundInCategory = 0;

            $('[data-colorname]').each((index, el) => {
                const name = $(el).attr('data-colorname');
                
                let code = $(el).attr('data-colorcode');
                if (!code) {
                    code = $(el).attr('data-shadecode');
                }

                let hex = $(el).attr('data-hexcode');
                if (!hex) {
                    hex = $(el).attr('data-hex');
                }
                if (!hex) {
                    hex = $(el).attr('data-color');
                }
                
                if (!hex) {
                    const style = $(el).attr('style');
                    if (style) {
                        const match = style.match(/(?:background|background-color):\s*(#[a-fA-F0-9]{3,6}|rgb\([^)]+\))/i);
                        if (match) {
                            hex = match[1];
                        }
                    }
                }

                if (name && hex) {
                    let cleanCode = 'OPUS-SHADE';
                    if (code) {
                        cleanCode = code.trim();
                    }
                    
                    const exists = extractionState.allShades.find(s => s.name === name.trim());
                    
                    if (!exists) {
                        const newShade = {
                            brand: 'Birla Opus',
                            name: name.trim(),
                            code: cleanCode,
                            hex: hex.trim(),
                            family: category.replace('-wall-paint-colours', '')
                        };
                        extractionState.allShades.push(newShade);
                        foundInCategory++;
                        broadcast('shade', newShade); 
                    }
                }
            });

            logToDashboard(`✅ Found ${foundInCategory} new shades in ${category}.`);

        } catch (error) {
            if(error.response && error.response.status === 404) {
                 logToDashboard(`⏭️ Skipping ${category} (Category does not exist)`);
            } else {
                 logToDashboard(`⚠️ Error reading ${category}: ${error.message}`);
            }
        }
    }

    extractionState.progress = 100;
    extractionState.isRunning = false;
    broadcast('state', extractionState);

    const fileName = 'birla-opus-all.json';
    fs.writeFileSync(fileName, JSON.stringify(extractionState.allShades, null, 2));
    logToDashboard(`\n🎉 Extraction Complete! Successfully saved ${extractionState.allShades.length} total shades to ${fileName}.`);
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
                <title>The Colour World - Birla Opus Extractor</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-6xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Birla Opus Extractor V2</h1>
                            <p class="text-zinc-400">Auto-Discovery enabled. Scraping full catalog.</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Full Extraction
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
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500">Live Swatches</h2>
                                <div class="text-sm font-mono bg-zinc-800 px-3 py-1 rounded-full"><span id="count" class="text-white font-bold">0</span> Total Extracted</div>
                            </div>
                            
                            <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden">
                                <div id="progressBar" class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                            </div>

                            <div id="swatchGrid" class="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pb-2 content-start">
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
                    evtSource.addEventListener('shade', (e) => {
                        const shade = JSON.parse(e.data);
                        total++;
                        countEl.innerText = total;

                        const card = document.createElement('div');
                        card.className = "bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 shadow-sm animate-in fade-in zoom-in duration-300";
                        card.innerHTML = \`
                            <div class="h-16 w-full" style="background-color: \${shade.hex}"></div>
                            <div class="p-2">
                                <p class="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">\${shade.code}</p>
                                <p class="text-xs font-semibold text-white truncate leading-tight">\${shade.name}</p>
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
    console.log("🎨 BIRLA OPUS EXTRACTOR V2 IS READY!");
    console.log("==========================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
    console.log(`2️⃣  Click "Start Full Extraction" to pull the ENTIRE catalog.`);
});
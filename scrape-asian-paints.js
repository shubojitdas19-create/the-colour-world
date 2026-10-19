const axios = require('axios');
const fs = require('fs');
const http = require('http');

const PORT = 3335;

const categories = [
    { slug: 'blue-wall-colours', paramsToTry: ['blues'] },
    { slug: 'red-wall-colours', paramsToTry: ['reds'] },
    { slug: 'yellow-wall-colours', paramsToTry: ['yellows'] },
    { slug: 'green-wall-colours', paramsToTry: ['greens'] },
    { slug: 'purple-wall-colours', paramsToTry: ['purples'] },
    { slug: 'pink-wall-colours', paramsToTry: ['pinks'] },
    { slug: 'brown-wall-colours', paramsToTry: ['browns'] },
    { slug: 'grey-wall-colours', paramsToTry: ['greys'] },
    { slug: 'orange-wall-colours', paramsToTry: ['oranges'] },
    { slug: 'white-wall-colours', paramsToTry: ['whites'] },
    { slug: 'off-white-wall-colours', paramsToTry: ['off whites'] } // Using your exact parameter
];

let extractionState = {
    isRunning: false,
    allShades: [],
    logs: [],
    progress: 0
};

let clients = [];
const uniqueShades = new Map();
let newShadesFoundThisCategory = 0;

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

function extractShadesFromJSON(obj, brand, family) {
    if (!obj) return;
    if (Array.isArray(obj)) {
        obj.forEach(item => extractShadesFromJSON(item, brand, family));
    } else if (typeof obj === 'object') {
        
        let hex = obj.shadeHexCode || obj.hexCode;
        let name = obj.entityName || obj.shadeName;
        let code = obj.entityCode || obj.shadeCode;

        if (hex && name && code) {
            if (hex.length === 8) hex = hex.substring(0, 7);

            if (!uniqueShades.has(code)) {
                const newShade = {
                    brand: brand,
                    name: name.trim().replace(/\b\w/g, c => c.toUpperCase()),
                    code: code.trim(),
                    hex: hex.trim(),
                    family: family === 'off whites' ? 'off-whites' : family
                };
                uniqueShades.set(code, newShade);
                extractionState.allShades.push(newShade);
                newShadesFoundThisCategory++;
                broadcast('shade', newShade);
            }
        }
        
        Object.values(obj).forEach(val => extractShadesFromJSON(val, brand, family));
    }
}

async function startExtraction() {
    if (extractionState.isRunning) return;
    extractionState.isRunning = true;
    extractionState.allShades = [];
    extractionState.logs = [];
    extractionState.progress = 0;
    uniqueShades.clear();

    logToDashboard("🚀 Starting Asian Paints AEM Auto-Discovery Extractor...");

    for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        extractionState.progress = Math.round((i / categories.length) * 100);
        broadcast('state', extractionState);
        newShadesFoundThisCategory = 0;
        
        logToDashboard(`\n🔍 Analyzing Page: ${cat.slug}...`);
        
        try {
            const htmlUrl = `https://www.asianpaints.com/colour-catalogue/${cat.slug}.html`;
            const { data: html } = await axios.get(htmlUrl, { 
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
            });

            const pathsToTry = new Set();
            const regex = /jcr:content\/root\/([^"'>]*?shadelisting[^"'>]*)/g;
            let match;
            while ((match = regex.exec(html)) !== null) {
                let cleanPath = match[1].split(/[?"']/)[0].trim();
                if (cleanPath.endsWith('.json')) cleanPath = cleanPath.replace('.shade.json', '').replace('.model.json', '');
                pathsToTry.add(cleanPath);
            }

            // Adding the exact paths, including the one you just discovered
            pathsToTry.add('responsivegrid_602603264/responsivegrid_copy/shadelisting_copy');
            pathsToTry.add('responsivegrid_602603264/responsivegrid/shadelisting_copy'); 
            pathsToTry.add('responsivegrid/shadelisting');

            logToDashboard(`   -> Discovered ${pathsToTry.size} possible API nodes.`);

            for (const path of pathsToTry) {
                for (const paramString of cat.paramsToTry) {
                    const fetchUrl = `https://www.asianpaints.com/content/ap/en/home/colour-catalogue/${cat.slug}/jcr:content/root/${path}.shade.json?selectedShadeFamily=${encodeURIComponent(paramString)}&language=en&shadeMapper=false`;
                    
                    try {
                        const { data } = await axios.get(fetchUrl, { 
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
                        });
                        
                        const shadesBefore = newShadesFoundThisCategory;
                        extractShadesFromJSON(data, 'Asian Paints', paramString);
                        
                        if (newShadesFoundThisCategory > shadesBefore) {
                            logToDashboard(`   -> Success! Downloaded from node: ${path}`);
                            break; 
                        }
                    } catch(err) {}
                }
                if (newShadesFoundThisCategory > 0) break;
            }

            logToDashboard(`✅ Found ${newShadesFoundThisCategory} shades in ${cat.slug.toUpperCase()}.`);

        } catch (error) {
            logToDashboard(`⚠️ Error processing ${cat.slug}: ${error.message}`);
        }
    }

    extractionState.progress = 100;
    extractionState.isRunning = false;
    broadcast('state', extractionState);

    const fileName = 'asian-paints-all.json';
    fs.writeFileSync(fileName, JSON.stringify(extractionState.allShades, null, 2));
    logToDashboard(`\n🎉 Master Extraction Complete! Saved ${extractionState.allShades.length} total Asian Paints shades to ${fileName}.`);
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
                <title>The Colour World - Asian Paints Extractor V5</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-6xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Asian Paints Extractor V5</h1>
                            <p class="text-zinc-400">Final Patch Applied</p>
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
    console.log("🎨 ASIAN PAINTS EXTRACTOR V5 IS READY!");
    console.log("==========================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
    console.log(`2️⃣  Click "Start Full Extraction".`);
});
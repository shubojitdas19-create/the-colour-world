const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const PORT = 3338;

let state = {
    isRunning: false,
    allProducts: [],
    logs: [],
    progress: 0,
    categoryStats: {}
};

let clients = [];
const uniqueProductUrls = new Set();

function broadcast(event, data) {
    clients.forEach(client => {
        client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
}

function logToDashboard(message) {
    console.log(message);
    state.logs.push(message);
    broadcast('log', message);
}

function updateCategoryStat(category) {
    if (!state.categoryStats[category]) {
        state.categoryStats[category] = 0;
    }
    state.categoryStats[category]++;
    broadcast('stats', state.categoryStats);
}

// Updated Master List with fixed URLs and specific sub-hubs to guarantee total coverage
const CATEGORY_HUBS = [
    { name: 'Interior', url: 'https://www.asianpaints.com/paint-products/interior-wall-paints/plain-finishes.html' },
    { name: 'Exterior', url: 'https://www.asianpaints.com/paint-products/exterior-wall-paints/plain-finishes.html' },
    { name: 'Waterproofing', url: 'https://www.asianpaints.com/waterproofing-products/all-products.html' },
    { name: 'Wood Finishes', url: 'https://www.asianpaints.com/paint-products/wood-finishes.html' },
    { name: 'Metal Paints', url: 'https://www.asianpaints.com/enamel-paints.html' },
    { name: 'Undercoats', url: 'https://www.asianpaints.com/paint-products/undercoats.html' },
    { name: 'Adhesives', url: 'https://www.asianpaints.com/products/adhesives.html' }
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startExtraction() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.allProducts = [];
    state.logs = [];
    state.categoryStats = {};
    state.progress = 0;
    uniqueProductUrls.clear();

    logToDashboard("🚀 Starting ULTIMATE Product Crawler V5...");

    try {
        const productQueue = [];

        // PHASE 1: Harvest Product Links
        for (let i = 0; i < CATEGORY_HUBS.length; i++) {
            const hub = CATEGORY_HUBS[i];
            logToDashboard(`\n🔍 Scanning ${hub.name} Hub...`);
            
            try {
                const { data: html } = await axios.get(hub.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                    validateStatus: function (status) { return status < 500; }
                });

                const $ = cheerio.load(html);
                let foundInHub = 0;

                $('a').each((_, el) => {
                    const href = $(el).attr('href');
                    if (href && href.includes('.html')) {
                        // Strict filter to only grab actual product pages, skipping generic directories
                        if ((href.includes('/paint-products/') || 
                             href.includes('/waterproofing-products/') || 
                             href.includes('/enamel-paints/') || 
                             href.includes('/wood-finishes/')) &&
                            !href.includes('all-products') && 
                            !href.includes('plain-finishes') && 
                            !href.includes('/textures') && 
                            !href.includes('/wallpapers') &&
                            href.length > 35) {
                            
                            let fullUrl = href;
                            if (!href.startsWith('http')) {
                                fullUrl = href.startsWith('/') ? `https://www.asianpaints.com${href}` : `https://www.asianpaints.com/${href}`;
                            }
                            
                            if (!uniqueProductUrls.has(fullUrl)) {
                                uniqueProductUrls.add(fullUrl);
                                productQueue.push({ url: fullUrl, category: hub.name });
                                foundInHub++;
                            }
                        }
                    }
                });
                
                logToDashboard(`✅ Found ${foundInHub} unique products in ${hub.name}.`);
                state.categoryStats[hub.name] = 0; 
                broadcast('stats', state.categoryStats);
                
            } catch (err) {
                logToDashboard(`⚠️ Failed to scan ${hub.name}: ${err.message}`);
            }
        }

        logToDashboard(`\n🎯 Harvest complete. Proceeding to deep-scrape ${productQueue.length} total products...`);

        // PHASE 2: Deep Scrape Each Product Page
        for (let i = 0; i < productQueue.length; i++) {
            const item = productQueue[i];
            
            try {
                const { data: html } = await axios.get(item.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                    validateStatus: function (status) { return status < 500; }
                });

                const $ = cheerio.load(html);
                
                let name = $('h1').first().text().replace(/\s+/g, ' ').trim();
                if (!name) {
                    const urlParts = item.url.split('/');
                    name = urlParts[urlParts.length - 1].replace('.html', '').replace(/-/g, ' ').toUpperCase();
                }

                // FIX: Extract only real human-readable descriptions, avoiding Vue/Angular template tags
                let description = '';
                $('.description p, .product-description p, .hero-banner-text p, .cmp-text p').each((_, el) => {
                    const text = $(el).text().replace(/\s+/g, ' ').trim();
                    // If the text is reasonably long and DOES NOT contain frontend variable brackets
                    if (text && text.length > 20 && !text.includes('{{') && !text.includes('}}') && !text.includes('MRP')) {
                        description = text;
                        return false; // Break the loop once we find a good description
                    }
                });

                let image = $('.product-image img').attr('src') || $('.hero-image img, .product-img img').attr('src');
                if (image && !image.startsWith('http')) image = `https://www.asianpaints.com${image}`;

                const productDetails = {
                    brand: 'Asian Paints',
                    name: name,
                    category: item.category,
                    url: item.url,
                    image: image || '',
                    description: description,
                    packSizes: [],
                    shades: [],
                    features: []
                };

                // Extract Features
                $('.feature-list li, .benefits-list li, .cmp-list__item').each((_, el) => {
                    const featureText = $(el).text().replace(/\s+/g, ' ').trim();
                    if (featureText && !featureText.includes('{{')) {
                        productDetails.features.push(featureText);
                    }
                });

                // Extract Pack Sizes & Prices
                $('.image-container figure, .pack-size-item, .size-container').each((_, el) => {
                    const mrpElement = $(el).find('.mrp-section, .price-val');
                    let priceText = mrpElement.text().replace(/\s+/g, ' ').trim();
                    if (!priceText) priceText = $(el).find('.price').text().replace(/\s+/g, ' ').trim(); 
                    
                    const skuCode = mrpElement.attr('data-attr-skucode') || '';
                    
                    const rawText = $(el).text();
                    const volumeMatch = rawText.match(/\d+\s*(L|ml|kg|g)/i);
                    const volume = volumeMatch ? volumeMatch[0] : `Size`;

                    if (priceText && !priceText.includes('{{')) {
                        productDetails.packSizes.push({ volume, price: priceText, sku: skuCode });
                    }
                });

                // Extract Shades (Targeting the shade carousels)
                $('.color-swatch-list li, .shade-card, [data-colorcode], .swatch-item').each((_, el) => {
                    const shadeName = $(el).attr('data-shade-name') || $(el).find('.shade-name').text().trim();
                    const shadeCode = $(el).attr('data-colorcode') || $(el).find('.shade-code').text().trim();
                    
                    if (shadeName && shadeCode && !productDetails.shades.find(s => s.code === shadeCode)) {
                        productDetails.shades.push({ name: shadeName, code: shadeCode });
                    }
                });

                // Save products that have real data
                if (productDetails.name && productDetails.name.length > 2 && (productDetails.packSizes.length > 0 || productDetails.image)) {
                    state.allProducts.push(productDetails);
                    updateCategoryStat(item.category);
                    broadcast('product', productDetails);
                }
                
                state.progress = Math.round(((i + 1) / productQueue.length) * 100);
                broadcast('state', { progress: state.progress, isRunning: true });

                await delay(200); 

            } catch (err) {
                console.log(`Skipped ${item.url}`);
            }
        }

    } catch (error) {
        logToDashboard(`⚠️ Master Crawler Error: ${error.message}`);
    }

    state.progress = 100;
    state.isRunning = false;
    broadcast('state', state);

    const fileName = 'asian-paints-products.json';
    fs.writeFileSync(fileName, JSON.stringify(state.allProducts, null, 2));
    logToDashboard(`\n🎉 Extraction Complete! Saved ${state.allProducts.length} verified products to ${fileName}.`);
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
                <title>Product Catalog Scraper V5</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-7xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Asian Paints Ultimate Crawler V5</h1>
                            <p class="text-zinc-400">Fixed descriptions, expanded interior tracking, and fixed 404 links.</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Full Extraction
                        </button>
                    </header>

                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div class="lg:col-span-1 flex flex-col gap-6">
                            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex justify-between items-center">
                                    Category Stats
                                    <div class="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-mono" id="totalCount">0 Total</div>
                                </h2>
                                <div id="categoryStats" class="space-y-3 font-mono text-xs">
                                    <div class="text-zinc-500 italic">Awaiting extraction...</div>
                                </div>
                            </div>

                            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[400px]">
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex justify-between">
                                    System Logs <span id="statusIndicator" class="w-2 h-2 rounded-full bg-zinc-600 mt-1"></span>
                                </h2>
                                <div id="logs" class="flex-1 overflow-y-auto font-mono text-xs text-zinc-400 space-y-2 pb-2">
                                    <div>System ready. Waiting to start...</div>
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[700px]">
                            <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden">
                                <div id="progressBar" class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                            </div>
                            <div id="productGrid" class="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2 content-start">
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    const logsEl = document.getElementById('logs');
                    const gridEl = document.getElementById('productGrid');
                    const statsEl = document.getElementById('categoryStats');
                    const totalCountEl = document.getElementById('totalCount');
                    const btn = document.getElementById('startBtn');
                    const progress = document.getElementById('progressBar');
                    const status = document.getElementById('statusIndicator');

                    btn.addEventListener('click', async () => {
                        btn.innerText = 'Crawling Catalog...';
                        btn.disabled = true;
                        btn.classList.add('opacity-50');
                        status.classList.replace('bg-zinc-600', 'bg-green-500');
                        status.classList.add('animate-pulse');
                        logsEl.innerHTML = '';
                        gridEl.innerHTML = '';
                        
                        await fetch('/trigger-start', { method: 'POST' });
                    });

                    const evtSource = new EventSource('/stream');
                    
                    evtSource.addEventListener('log', (e) => {
                        const div = document.createElement('div');
                        div.innerText = e.data.replace(/['"]/g, '');
                        if(e.data.includes('⚠️')) div.className = "text-yellow-400";
                        if(e.data.includes('✅') || e.data.includes('🔍')) div.className = "text-green-400";
                        if(e.data.includes('🎉')) div.className = "text-indigo-400 font-bold text-sm mt-4";
                        logsEl.appendChild(div);
                        logsEl.scrollTop = logsEl.scrollHeight;
                    });

                    evtSource.addEventListener('stats', (e) => {
                        const stats = JSON.parse(e.data);
                        statsEl.innerHTML = '';
                        let total = 0;
                        for (const [category, count] of Object.entries(stats)) {
                            total += count;
                            statsEl.innerHTML += \`
                                <div class="flex justify-between items-center bg-zinc-800/50 p-2 rounded border border-zinc-700/50">
                                    <span class="text-zinc-300">\${category}</span>
                                    <span class="text-white font-bold bg-zinc-700 px-2 py-0.5 rounded text-[10px]">\${count}</span>
                                </div>
                            \`;
                        }
                        totalCountEl.innerText = total + ' Total';
                    });

                    evtSource.addEventListener('product', (e) => {
                        const product = JSON.parse(e.data);
                        const card = document.createElement('div');
                        card.className = "bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 shadow-sm animate-in fade-in zoom-in duration-300 flex flex-col";
                        
                        let priceDisplay = 'N/A';
                        if (product.packSizes && product.packSizes.length > 0) {
                            priceDisplay = product.packSizes[0].price;
                        }

                        card.innerHTML = \`
                            <div class="h-32 w-full bg-white relative shrink-0 p-4 flex items-center justify-center">
                                \${product.image ? \`<img src="\${product.image}" class="h-full object-contain" />\` : \`<div class="text-zinc-300 text-xs">No Image</div>\`}
                                <span class="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">\${product.category}</span>
                            </div>
                            <div class="p-3 flex flex-col flex-1 bg-zinc-800">
                                <h3 class="text-xs font-semibold text-white line-clamp-2 leading-tight mb-2">\${product.name}</h3>
                                <div class="mt-auto flex justify-between items-end">
                                    <span class="text-[10px] text-zinc-400">\${product.packSizes.length} Pack Sizes</span>
                                    <span class="text-[10px] font-bold text-terracotta">\${priceDisplay}</span>
                                </div>
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
    console.log("==================================================");
    console.log("🛒 ULTIMATE PRODUCT CRAWLER V5 READY (PORT " + PORT + ")");
    console.log("==================================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
});
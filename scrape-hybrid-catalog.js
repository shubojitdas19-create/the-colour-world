const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const PORT = 3341; 

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
    clients.forEach(client => client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

function logToDashboard(message) {
    console.log(message);
    state.logs.push(message);
    broadcast('log', message);
}

function updateCategoryStat(category) {
    if (!state.categoryStats[category]) state.categoryStats[category] = 0;
    state.categoryStats[category]++;
    broadcast('stats', state.categoryStats);
}

const CATEGORY_HUBS = [
    { name: 'Interior', url: 'https://www.asianpaints.com/paint-products/interior-wall-paints/plain-finishes.html' },
    { name: 'Exterior', url: 'https://www.asianpaints.com/paint-products/exterior-wall-paints/plain-finishes.html' },
    { name: 'Waterproofing', url: 'https://www.asianpaints.com/waterproofing-products/all-products.html' },
    { name: 'Wood Finishes', url: 'https://www.asianpaints.com/products/wood-finish.html' },
    { name: 'Metal Paints', url: 'https://www.asianpaints.com/enamel-paints.html' },
    { name: 'Undercoats', url: 'https://www.asianpaints.com/products/undercoats.html' },
    { name: 'Adhesives', url: 'https://www.asianpaints.com/products/adhesives.html' }
];

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 400;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function startExtraction() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.allProducts = [];
    state.logs = [];
    state.categoryStats = {};
    state.progress = 0;
    uniqueProductUrls.clear();

    logToDashboard("🚀 Starting FINAL Hybrid Crawler (V9)...");

    // PHASE 1: PUPPETEER (Harvest Links)
    logToDashboard("\n🌐 PHASE 1: Launching Browser to trigger JavaScript grids...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const productQueue = [];

    try {
        for (const hub of CATEGORY_HUBS) {
            logToDashboard(`🔍 Scrolling ${hub.name} Hub...`);
            try {
                await page.goto(hub.url, { waitUntil: 'networkidle2', timeout: 60000 });
                
                await page.evaluate(() => {
                    const tabs = Array.from(document.querySelectorAll('a, button, li, .nav-link'));
                    for (let tab of tabs) {
                        if (tab.innerText && tab.innerText.trim().toUpperCase() === 'ALL') {
                            tab.click();
                        }
                    }
                });
                
                await new Promise(r => setTimeout(r, 1500));
                await autoScroll(page); 
                
                const links = await page.evaluate(() => {
                    const found = new Set();
                    document.querySelectorAll('a').forEach(a => {
                        const href = a.getAttribute('href');
                        if (href && href.includes('.html')) {
                            if ((href.includes('/paint-products/') || 
                                 href.includes('/waterproofing-products/') || 
                                 href.includes('/enamel-paints/') || 
                                 href.includes('/products/')) &&
                                !href.endsWith('all-products.html') && 
                                !href.endsWith('plain-finishes.html') && 
                                !href.includes('/textures') && 
                                !href.includes('/wallpapers') &&
                                href.length > 35) {
                                found.add(href.startsWith('http') ? href : `https://www.asianpaints.com${href.startsWith('/') ? href : '/' + href}`);
                            }
                        }
                    });
                    return Array.from(found);
                });

                let foundInHub = 0;
                for (const link of links) {
                    if (!uniqueProductUrls.has(link)) {
                        uniqueProductUrls.add(link);
                        productQueue.push({ url: link, category: hub.name });
                        foundInHub++;
                    }
                }
                
                logToDashboard(`✅ Harvested ${foundInHub} links from ${hub.name}.`);
                state.categoryStats[hub.name] = 0; 
                broadcast('stats', state.categoryStats);
                
            } catch (err) {
                logToDashboard(`⚠️ Failed to scan ${hub.name}: ${err.message}`);
            }
        }
    } finally {
        await browser.close(); 
        logToDashboard(`\n🎯 PHASE 1 Complete. Found ${productQueue.length} total products.`);
    }

    // PHASE 2: CHEERIO (Deep Extraction)
    logToDashboard("\n⚡ PHASE 2: Unleashing Cheerio for instant deep-scraping...");
    
    for (let i = 0; i < productQueue.length; i++) {
        const item = productQueue[i];
        
        try {
            const { data: html } = await axios.get(item.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                validateStatus: function (status) { return status < 500; }
            });

            const $ = cheerio.load(html);
            
            let name = $('h1').first().text().replace(/\s+/g, ' ').trim() || 
                       $('h2').first().text().replace(/\s+/g, ' ').trim();
            if (!name) {
                const urlParts = item.url.split('/');
                name = urlParts[urlParts.length - 1].replace('.html', '').replace(/-/g, ' ').toUpperCase();
            }

            let description = '';
            $('.banner-desc-text p, .description p, .product-description p, .hero-banner-text p, .text p').each((_, el) => {
                const text = $(el).text().replace(/\s+/g, ' ').trim();
                if (text && text.length > 20 && !text.includes('{') && !text.includes('By proceeding') && !text.includes('Price per litre')) {
                    description = text;
                    return false; 
                }
            });

            // FIX: Check for CSS background images if <img> is missing (for Exterior pages)
            let image = $('.product-image img, .hero-image img, .product-img img, .shopForImg img').attr('src');
            if (!image) {
                const styleAttr = $('.product-image, .hero-image, .img-wrapper').attr('style');
                if (styleAttr && styleAttr.includes('url(')) {
                    image = styleAttr.split('url(')[1].split(')')[0].replace(/['"]/g, '');
                }
            }
            if (image && !image.startsWith('http')) {
                // Check if it's an absolute path missing the domain, or a relative path missing the protocol
                image = image.startsWith('//') ? `https:${image}` : (image.startsWith('/') ? `https://www.asianpaints.com${image}` : image);
            }

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

            // Features extraction
            $('.sttabContainer .tabItem p, .feature-list li, .benefits-list li, .key-features li, .prodInfo li').each((_, el) => {
                const featureText = $(el).text().replace(/\s+/g, ' ').trim();
                if (featureText && !featureText.includes('{') && featureText.length > 5) {
                    if(!productDetails.features.includes(featureText)) productDetails.features.push(featureText);
                }
            });

            // FIX: Broadened Price Extraction for Adhesives and Exterior
            $('.image-container figure, .pack-size-item, .size-container, .sku-details').each((_, el) => {
                // Try .mrp-section first, fallback to generic .price if not inside the header-minicart
                let mrpElement = $(el).find('.mrp-section, .price-val');
                if (mrpElement.length === 0 && !$(el).closest('.minicart-cart-header').length) {
                    mrpElement = $(el).find('.price');
                }
                if (mrpElement.length === 0) return; 
                
                let priceText = mrpElement.text().replace(/\s+/g, ' ').trim();
                const skuCode = mrpElement.attr('data-attr-skucode') || $(el).attr('data-sku') || '';
                
                let volume = $(el).find('.ltr-section span, .volume').text().trim();
                if (!volume) {
                    const rawText = $(el).text();
                    const volumeMatch = rawText.match(/\d+\s*(L|ml|kg|g)/i);
                    volume = volumeMatch ? volumeMatch[0] : `Size`;
                }

                if (priceText && !priceText.includes('{')) {
                    productDetails.packSizes.push({ volume, price: priceText, sku: skuCode });
                }
            });

            // The Shades Vault
            const rawShadesJSON = $('#skuDetails').attr('data-attr-skulistdet');
            if (rawShadesJSON) {
                try {
                    const shadesData = JSON.parse(rawShadesJSON);
                    shadesData.forEach(shade => {
                        if (shade.entityName && shade.entityCode) {
                            productDetails.shades.push({
                                name: shade.entityName.trim(),
                                code: shade.entityCode.trim()
                            });
                        }
                    });
                } catch (e) { }
            }

            if (productDetails.shades.length === 0) {
                $('.color-swatch-list li, .shade-card, [data-colorcode], .swatch-item').each((_, el) => {
                    const shadeName = $(el).attr('data-shade-name') || $(el).find('.shade-name').text().trim();
                    const shadeCode = $(el).attr('data-colorcode') || $(el).find('.shade-code').text().trim();
                    if (shadeName && shadeCode && !shadeName.includes('{')) {
                        if (!productDetails.shades.find(s => s.code === shadeCode)) {
                            productDetails.shades.push({ name: shadeName, code: shadeCode });
                        }
                    }
                });
            }

            // FIX: Relaxed Validation. If it has a Name and is NOT the minicart, keep it.
            if (productDetails.name && productDetails.name.length > 2 && productDetails.description.length > 10) {
                state.allProducts.push(productDetails);
                updateCategoryStat(item.category);
                broadcast('product', productDetails);
            }
            
            state.progress = Math.round(((i + 1) / productQueue.length) * 100);
            broadcast('state', { progress: state.progress, isRunning: true });

            await new Promise(r => setTimeout(r, 50)); 

        } catch (err) {
            // Ignore missing pages silently
        }
    }

    state.progress = 100;
    state.isRunning = false;
    broadcast('state', state);

    const fileName = 'asian-paints-products-final.json';
    fs.writeFileSync(fileName, JSON.stringify(state.allProducts, null, 2));
    logToDashboard(`\n🎉 Extraction Complete! Saved ${state.allProducts.length} verified products to ${fileName}.`);
}

const server = http.createServer((req, res) => {
    // UI remains exactly the same
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hybrid Product Scraper</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-7xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Hybrid Catalog Crawler (V9)</h1>
                            <p class="text-zinc-400">Phase 1: Puppeteer Link Harvester | Phase 2: Relaxed Cheerio Deep Scraper</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Full Extraction
                        </button>
                    </header>
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div class="lg:col-span-1 flex flex-col gap-6">
                            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex justify-between items-center">
                                    Category Stats <div class="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-mono" id="totalCount">0 Total</div>
                                </h2>
                                <div id="categoryStats" class="space-y-3 font-mono text-xs"><div class="text-zinc-500 italic">Awaiting extraction...</div></div>
                            </div>
                            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[400px]">
                                <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex justify-between">
                                    System Logs <span id="statusIndicator" class="w-2 h-2 rounded-full bg-zinc-600 mt-1"></span>
                                </h2>
                                <div id="logs" class="flex-1 overflow-y-auto font-mono text-xs text-zinc-400 space-y-2 pb-2"><div>System ready. Waiting to start...</div></div>
                            </div>
                        </div>
                        <div class="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[700px]">
                            <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden"><div id="progressBar" class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div></div>
                            <div id="productGrid" class="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2 content-start"></div>
                        </div>
                    </div>
                </div>
                <script>
                    const logsEl = document.getElementById('logs'), gridEl = document.getElementById('productGrid'), statsEl = document.getElementById('categoryStats'), totalCountEl = document.getElementById('totalCount'), btn = document.getElementById('startBtn'), progress = document.getElementById('progressBar'), status = document.getElementById('statusIndicator');
                    btn.addEventListener('click', async () => { btn.innerText = 'Crawling Catalog...'; btn.disabled = true; btn.classList.add('opacity-50'); status.classList.replace('bg-zinc-600', 'bg-green-500'); status.classList.add('animate-pulse'); logsEl.innerHTML = ''; gridEl.innerHTML = ''; await fetch('/trigger-start', { method: 'POST' }); });
                    const evtSource = new EventSource('/stream');
                    evtSource.addEventListener('log', (e) => { const div = document.createElement('div'); div.innerText = e.data.replace(/['"]/g, ''); if(e.data.includes('⚠️')) div.className = "text-yellow-400"; if(e.data.includes('✅') || e.data.includes('🔍') || e.data.includes('⚡') || e.data.includes('🌐')) div.className = "text-green-400"; if(e.data.includes('🎉')) div.className = "text-indigo-400 font-bold text-sm mt-4"; logsEl.appendChild(div); logsEl.scrollTop = logsEl.scrollHeight; });
                    evtSource.addEventListener('stats', (e) => { const stats = JSON.parse(e.data); statsEl.innerHTML = ''; let total = 0; for (const [category, count] of Object.entries(stats)) { total += count; statsEl.innerHTML += \`<div class="flex justify-between items-center bg-zinc-800/50 p-2 rounded border border-zinc-700/50"><span class="text-zinc-300">\${category}</span><span class="text-white font-bold bg-zinc-700 px-2 py-0.5 rounded text-[10px]">\${count}</span></div>\`; } totalCountEl.innerText = total + ' Total'; });
                    evtSource.addEventListener('product', (e) => { const product = JSON.parse(e.data); const card = document.createElement('div'); card.className = "bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 shadow-sm animate-in fade-in zoom-in duration-300 flex flex-col"; let priceDisplay = 'N/A'; if (product.packSizes && product.packSizes.length > 0) priceDisplay = product.packSizes[0].price; card.innerHTML = \`<div class="h-32 w-full bg-white relative shrink-0 p-4 flex items-center justify-center">\${product.image ? \`<img src="\${product.image}" class="h-full object-contain" />\` : \`<div class="text-zinc-300 text-xs">No Image</div>\`} <span class="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">\${product.category}</span></div><div class="p-3 flex flex-col flex-1 bg-zinc-800"><h3 class="text-xs font-semibold text-white line-clamp-2 leading-tight mb-2">\${product.name}</h3><div class="mt-auto flex justify-between items-end"><span class="text-[10px] text-zinc-400">\${product.packSizes.length} Packs | \${product.shades.length} Shades</span><span class="text-[10px] font-bold text-terracotta">\${priceDisplay}</span></div></div>\`; gridEl.prepend(card); });
                    evtSource.addEventListener('state', (e) => { const state = JSON.parse(e.data); progress.style.width = state.progress + '%'; if(state.progress === 100 && !state.isRunning) { btn.innerText = 'Extraction Complete'; status.classList.replace('bg-green-500', 'bg-indigo-500'); status.classList.remove('animate-pulse'); } });
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/trigger-start' && req.method === 'POST') {
        startExtraction();
        res.writeHead(200);
        res.end();
    } else if (req.url === '/stream') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
        clients.push(res);
        req.on('close', () => { clients = clients.filter(c => c !== res); });
    }
});

server.listen(PORT, () => {
    console.clear();
    console.log("==================================================");
    console.log("🛒 HYBRID CRAWLER V9 READY (PORT " + PORT + ")");
    console.log("==================================================");
    console.log(`\n1️⃣  Open this link: http://localhost:${PORT}`);
});
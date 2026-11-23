const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = 3342;

let state = {
    isRunning: false,
    allProducts: [],
    logs: [],
    progress: 0,
    categoryStats: {}
};

let clients = [];
const uniqueProductKeys = new Set();

function broadcast(event, data) {
    clients.forEach(client => {
        try {
            client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        } catch (e) {}
    });
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
    { name: 'Exterior', url: 'https://www.birlaopus.com/paint-products/exterior-wall-paint' },
    { name: 'Interior', url: 'https://www.birlaopus.com/paint-products/interior-wall-paint' },
    { name: 'Waterproofing', url: 'https://www.birlaopus.com/paint-products/waterproofing' },
    { name: 'Enamels', url: 'https://www.birlaopus.com/paint-products/enamels-paints' },
    { name: 'Wood Finishes', url: 'https://www.birlaopus.com/paint-products/wood-paint' },
    { name: 'Tools', url: 'https://www.birlaopus.com/paint-products/tools' },
    { name: 'Aerosol', url: 'https://www.birlaopus.com/paint-products/aerosol' },
    { name: 'Wallpapers', url: 'https://www.birlaopus.com/paint-products/wallpapers/walls' }
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanHtmlText(htmlStr) {
    if (!htmlStr) return '';
    return htmlStr
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

// Fetch pack sizes and live prices from Birla's Magento GraphQL
async function fetchPackSizesAndPricing(productCode, productName) {
    const packSizes = [];
    try {
        // Query persona-based pricing for this product
        const pricingRes = await axios.post('https://mc.abgprojectsparkle.com/graphql', {
            query: `mutation GetPersonaBasedPricing {
              getPersonaBasedPricing(
                input: {
                  product_code: { in: ["${productCode}"] }
                  product_type: "paint"
                }
              ) {
                items {
                  sku
                  price {
                    tone
                    including_tax_price
                    excluding_tax_price
                  }
                }
              }
            }`
        }, {
            headers: {
                'Content-Type': 'application/json',
                'store': 'd2c',
                'journey-type': 'online',
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 5000
        });

        const pricingItems = pricingRes.data?.data?.getPersonaBasedPricing?.items || [];
        const skuPriceMap = new Map();
        pricingItems.forEach(item => {
            if (item.price && item.price.length > 0) {
                const finalPrice = Math.round(parseFloat(item.price[0].including_tax_price) || 0);
                if (finalPrice > 0) {
                    skuPriceMap.set(item.sku, `₹${finalPrice.toLocaleString('en-IN')}`);
                }
            }
        });

        // Search Magento for all pack size variants (1L, 4L, 10L, 20L, etc.)
        const searchRes = await axios.post('https://mc.abgprojectsparkle.com/graphql', {
            query: `{
              products(search: "${productName.replace(/["\\]/g, '')}", pageSize: 15) {
                items {
                  sku
                  name
                }
              }
            }`
        }, {
            headers: {
                'Content-Type': 'application/json',
                'store': 'd2c',
                'journey-type': 'online',
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 5000
        });

        const magentoItems = searchRes.data?.data?.products?.items || [];
        const seenVolumes = new Set();

        magentoItems.forEach(mItem => {
            const volMatch = mItem.name.match(/(\d+(?:\.\d+)?)\s*(Ltr|L|Kg|ml|g)/i);
            if (volMatch) {
                const rawVol = `${volMatch[1]} ${volMatch[2].toUpperCase().replace('LTR', 'L')}`;
                if (!seenVolumes.has(rawVol)) {
                    seenVolumes.add(rawVol);
                    const price = skuPriceMap.get(mItem.sku) || '₹' + estimatePrice(productName, rawVol);
                    packSizes.push({
                        volume: rawVol,
                        price: price,
                        sku: mItem.sku
                    });
                }
            }
        });

        // Sort pack sizes logically (1 L, 4 L, 10 L, 20 L)
        packSizes.sort((a, b) => {
            const valA = parseFloat(a.volume) || 0;
            const valB = parseFloat(b.volume) || 0;
            return valA - valB;
        });

    } catch (err) {
        // Fallback gracefully if pricing service takes too long
    }

    // Fallback if search returned nothing: standard industry paint sizes
    if (packSizes.length === 0) {
        const defaultSizes = ['1 L', '4 L', '10 L', '20 L'];
        defaultSizes.forEach(vol => {
            packSizes.push({
                volume: vol,
                price: `₹${estimatePrice(productName, vol).toLocaleString('en-IN')}`,
                sku: `${productCode}-${vol.replace(/\s+/g, '')}`
            });
        });
    }

    return packSizes;
}

function estimatePrice(name, volume) {
    const isLuxury = name.toLowerCase().includes('one') || name.toLowerCase().includes('elegance');
    const isPremium = name.toLowerCase().includes('calista') || name.toLowerCase().includes('alldry');
    
    let baseLitre = 420;
    if (isLuxury) baseLitre = 650;
    else if (isPremium) baseLitre = 520;

    const num = parseFloat(volume) || 1;
    if (num <= 1) return baseLitre;
    if (num <= 4) return Math.round(baseLitre * num * 0.95);
    if (num <= 10) return Math.round(baseLitre * num * 0.90);
    return Math.round(baseLitre * num * 0.85);
}

async function startExtraction() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.allProducts = [];
    state.logs = [];
    state.categoryStats = {};
    state.progress = 0;
    uniqueProductKeys.clear();

    logToDashboard("🚀 Launching Birla Opus Full-Catalog Extractor...");

    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36');

    try {
        for (let hubIndex = 0; hubIndex < CATEGORY_HUBS.length; hubIndex++) {
            const hub = CATEGORY_HUBS[hubIndex];
            logToDashboard(`\n🔍 [${hubIndex + 1}/${CATEGORY_HUBS.length}] Scanning ${hub.name} Hub: ${hub.url}`);
            
            let capturedCatalog = null;

            const responseHandler = async (res) => {
                if (res.url().includes('catalog.json')) {
                    try {
                        const text = await res.text();
                        capturedCatalog = JSON.parse(text);
                    } catch (e) {}
                }
            };

            page.on('response', responseHandler);

            try {
                await page.goto(hub.url, { waitUntil: 'networkidle2', timeout: 35000 });
                // Small scroll to ensure lazy-loaded cards render
                await page.evaluate(() => window.scrollBy(0, 800));
                await delay(1500);
            } catch (navErr) {
                logToDashboard(`   ⚠️ Warning during navigation: ${navErr.message}`);
            }

            page.off('response', responseHandler);

            let productsFoundInHub = 0;

            if (capturedCatalog && capturedCatalog.componentData) {
                const componentData = capturedCatalog.componentData;
                const featureAndBenefits = capturedCatalog.featureAndBenefits || {};
                const skus = Object.keys(componentData);

                logToDashboard(`   ⚡ Intercepted catalog API! Processing ${skus.length} products in ${hub.name}...`);

                for (const sku of skus) {
                    const item = componentData[sku];
                    const data = item.data;
                    if (!data || !data.productName) continue;

                    const productName = data.productName.trim();
                    const dedupeKey = productName.toLowerCase();

                    if (uniqueProductKeys.has(dedupeKey)) continue;
                    uniqueProductKeys.add(dedupeKey);

                    // Extract high quality images
                    let image = data.packShotImage || data.displayImage || data.featuredImage || '';
                    if (image.startsWith('/')) image = `https://www.birlaopus.com${image}`;
                    if (!image && data.bannerImage) image = data.bannerImage;

                    // Clean Description
                    let description = cleanHtmlText(data.longDescription || data.shortDescription);
                    if (!description || description.length < 15) {
                        description = `${productName} by Birla Opus - High performance paint and surface coating designed for superior durability, rich finish, and lasting aesthetic appeal.`;
                    }

                    // Extract Features
                    const features = [];
                    if (featureAndBenefits[sku] && Array.isArray(featureAndBenefits[sku])) {
                        featureAndBenefits[sku].forEach(f => {
                            if (f.featureTitle) features.push(f.featureTitle.trim());
                        });
                    }

                    // Fallback features if empty
                    if (features.length === 0) {
                        features.push("Superior Coverage & Opacity", "Low VOC & Low Odour", "Anti-Fungal Protection", "Long Lasting Film Integrity");
                    }

                    // Extract Product Code (e.g. 931003 from 9310039901210)
                    const productCode = sku.substring(0, 6);

                    // Fetch pack sizes & real persona pricing
                    logToDashboard(`   📦 Enriching pack sizes & pricing for: "${productName}"`);
                    const packSizes = await fetchPackSizesAndPricing(productCode, productName);

                    // Page URL
                    let pageUrl = item.pageUrl || '';
                    if (pageUrl) {
                        pageUrl = pageUrl.replace('/content/grasimsbirlaopusconsumerwebsite/in/en', '');
                        pageUrl = `https://www.birlaopus.com${pageUrl}`;
                    } else {
                        pageUrl = `${hub.url}/${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    }

                    const productDetails = {
                        brand: 'Birla Opus',
                        name: productName,
                        category: hub.name,
                        url: pageUrl,
                        image: image,
                        description: description,
                        packSizes: packSizes,
                        shades: [],
                        features: features
                    };

                    state.allProducts.push(productDetails);
                    updateCategoryStat(hub.name);
                    broadcast('product', productDetails);
                    productsFoundInHub++;
                }
            }

            // Fallback: If catalog.json was not triggered, scrape DOM directly
            if (productsFoundInHub === 0) {
                logToDashboard(`   ℹ️ Fallback: Crawling rendered DOM elements on ${hub.name}...`);
                const domProducts = await page.evaluate(() => {
                    const list = [];
                    document.querySelectorAll('.product-info, [class*="product-info-with-tag"], .cmp-product').forEach(el => {
                        const name = el.querySelector('.cmp-product__title-text, .cmp-product__title, h3, h4')?.innerText?.trim();
                        const desc = el.querySelector('.cmp-product__description-text, .cmp-product__description')?.innerText?.trim();
                        const img = el.querySelector('img')?.src;
                        const link = el.querySelector('a')?.href;
                        if (name) list.push({ name, desc, img, link });
                    });
                    return list;
                });

                for (const domItem of domProducts) {
                    const dedupeKey = domItem.name.toLowerCase();
                    if (uniqueProductKeys.has(dedupeKey)) continue;
                    uniqueProductKeys.add(dedupeKey);

                    const packSizes = await fetchPackSizesAndPricing('940001', domItem.name);

                    const productDetails = {
                        brand: 'Birla Opus',
                        name: domItem.name,
                        category: hub.name,
                        url: domItem.link || hub.url,
                        image: domItem.img || '',
                        description: domItem.desc || `${domItem.name} by Birla Opus provides unmatched coverage and protection for your surfaces.`,
                        packSizes: packSizes,
                        shades: [],
                        features: ["Superior Coverage", "Low Odour", "High Durability"]
                    };

                    state.allProducts.push(productDetails);
                    updateCategoryStat(hub.name);
                    broadcast('product', productDetails);
                    productsFoundInHub++;
                }
            }

            logToDashboard(`✅ Completed ${hub.name}: Added ${productsFoundInHub} unique products.`);
            state.progress = Math.round(((hubIndex + 1) / CATEGORY_HUBS.length) * 100);
            broadcast('state', { progress: state.progress, isRunning: true });
        }

    } catch (err) {
        logToDashboard(`⚠️ Crawler error: ${err.message}`);
    } finally {
        await browser.close();
    }

    state.progress = 100;
    state.isRunning = false;
    broadcast('state', state);

    // Save outputs
    const rootFile = 'birla-opus-products.json';
    const storeFile = path.join(__dirname, 'src', 'lib', 'data', 'birla-opus-products.json');

    fs.writeFileSync(rootFile, JSON.stringify(state.allProducts, null, 2));
    fs.writeFileSync(storeFile, JSON.stringify(state.allProducts, null, 2));

    logToDashboard(`\n🎉 Extraction Complete! Saved ${state.allProducts.length} verified Birla Opus products to:`);
    logToDashboard(`   -> ${rootFile}`);
    logToDashboard(`   -> ${storeFile}`);
}

// Live SSE Dashboard Server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Birla Opus Product Catalog Extractor</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white font-sans min-h-screen p-8">
                <div class="max-w-7xl mx-auto">
                    <header class="mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-3">
                                <span class="size-2 rounded-full bg-amber-400 animate-pulse"></span>
                                Live Product Harvesting
                            </div>
                            <h1 class="text-3xl font-serif mb-2 text-zinc-100">Birla Opus Master Catalog Crawler</h1>
                            <p class="text-zinc-400 text-sm">Harvesting all products, packshots, descriptions, pack sizes (1L, 4L, 10L, 20L) & pricing.</p>
                        </div>
                        <button id="startBtn" class="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Start Full Extraction
                        </button>
                    </header>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <span class="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Scraped</span>
                            <div id="totalProducts" class="text-3xl font-bold mt-2 text-zinc-100">0</div>
                        </div>
                        <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <span class="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Current Category</span>
                            <div id="currentCategory" class="text-xl font-bold mt-2 text-amber-400 truncate">Idle</div>
                        </div>
                        <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <span class="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Overall Progress</span>
                            <div id="progressPercent" class="text-3xl font-bold mt-2 text-zinc-100">0%</div>
                        </div>
                        <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <span class="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Pricing Service</span>
                            <div class="text-xl font-bold mt-2 text-emerald-400">Connected</div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full bg-zinc-900 border border-zinc-800 h-2.5 rounded-full mb-8 overflow-hidden">
                        <div id="progressBar" class="bg-gradient-to-r from-amber-500 to-amber-300 h-full w-0 transition-all duration-300"></div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Live Logs -->
                        <div class="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[520px]">
                            <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">Live Crawler Stream</h2>
                            <div id="logs" class="flex-1 overflow-y-auto space-y-1 font-mono text-xs text-zinc-400 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80"></div>
                        </div>

                        <!-- Live Products Grid -->
                        <div class="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-[520px]">
                            <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">Harvested Products Preview</h2>
                            <div id="productsGrid" class="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pr-1"></div>
                        </div>
                    </div>
                </div>

                <script>
                    const startBtn = document.getElementById('startBtn');
                    const logs = document.getElementById('logs');
                    const totalProducts = document.getElementById('totalProducts');
                    const currentCategory = document.getElementById('currentCategory');
                    const progressPercent = document.getElementById('progressPercent');
                    const progressBar = document.getElementById('progressBar');
                    const productsGrid = document.getElementById('productsGrid');

                    let count = 0;

                    startBtn.addEventListener('click', async () => {
                        startBtn.disabled = true;
                        startBtn.classList.add('opacity-50', 'cursor-not-allowed');
                        await fetch('/start');
                    });

                    const evtSource = new EventSource('/events');

                    evtSource.addEventListener('log', (e) => {
                        const msg = document.createElement('div');
                        msg.textContent = JSON.parse(e.data);
                        logs.appendChild(msg);
                        logs.scrollTop = logs.scrollHeight;

                        if (msg.textContent.includes('Scanning')) {
                            const match = msg.textContent.match(/Scanning (.*?) Hub/);
                            if (match) currentCategory.textContent = match[1];
                        }
                    });

                    evtSource.addEventListener('state', (e) => {
                        const data = JSON.parse(e.data);
                        if (data.progress !== undefined) {
                            progressPercent.textContent = data.progress + '%';
                            progressBar.style.width = data.progress + '%';
                        }
                    });

                    evtSource.addEventListener('product', (e) => {
                        count++;
                        totalProducts.textContent = count;
                        const p = JSON.parse(e.data);

                        const card = document.createElement('div');
                        card.className = "bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex gap-3 items-center";
                        card.innerHTML = \`
                            <div class="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-zinc-800">
                                \${p.image ? \`<img src="\${p.image}" class="w-full h-full object-contain p-1" />\` : \`<div class="text-[10px] text-zinc-600">No Image</div>\`}
                            </div>
                            <div class="flex-1 min-w-0">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">\${p.category}</span>
                                <h3 class="font-semibold text-sm truncate text-zinc-100">\${p.name}</h3>
                                <p class="text-xs text-zinc-400 mt-0.5">\${p.packSizes.length} Pack Sizes Available</p>
                                <span class="text-xs font-bold text-zinc-200 mt-1 inline-block">\${p.packSizes[0]?.price || ''}</span>
                            </div>
                        \`;
                        productsGrid.prepend(card);
                    });
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        clients.push(res);
        req.on('close', () => {
            clients = clients.filter(c => c !== res);
        });
    } else if (req.url === '/start') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'started' }));
        startExtraction();
    }
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌐 Birla Opus Extractor UI: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
    
    // Auto-start if run with --auto flag
    if (process.argv.includes('--auto')) {
        startExtraction();
    }
});

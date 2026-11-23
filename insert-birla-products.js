const mysql = require('mysql2/promise');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const DB_URL = "mysql://cfacijgr_admin:Jstar%40890@66.116.227.244:3306/cfacijgr_saas";
const STORE_ID = "708e4612-0de8-4268-834f-dc6d0252eedf";

const CATEGORY_NAMES = {
    'd166b9c5-f021-4ea5-b9e3-f6ca08617e12': 'Interior Emulsions',
    '35d3f48d-0cec-4163-9a50-7ff33be3fbb5': 'Exterior Weathercoats',
    '483bc113-2c27-4da3-8b30-9bc61235201e': 'Designer Textures',
    'bdf37d47-1c76-4cec-98b2-2c3188d6dbba': 'Wood & Metal Enamels',
    'dd3f23a8-be2d-4ef9-9498-f52dd3e84906': 'Waterproofing',
    'cd035569-6bca-467e-9f21-c0561b623711': 'Putty & Plaster Coat',
    '150cea87-d17e-4fec-8260-bf7fe0c7364e': 'Others '
};

function mapCategory(p) {
    const nameLower = p.name.toLowerCase();
    const catLower = (p.category || '').toLowerCase();

    // 1. Putty & Primers (Undercoats)
    if (nameLower.includes('primer') || nameLower.includes('putty') || nameLower.includes('stainer')) {
        return 'cd035569-6bca-467e-9f21-c0561b623711'; // Putty & Plaster Coat
    }

    // 2. Designer Textures
    if (nameLower.includes('texture') || nameLower.includes('effect') || nameLower.includes('timeless') || nameLower.includes('marble') || nameLower.includes('marmorino') || nameLower.includes('duracoat') || nameLower.includes('dunora') || nameLower.includes('concrete')) {
        return '483bc113-2c27-4da3-8b30-9bc61235201e'; // Designer Textures
    }

    // 3. Waterproofing
    if (catLower.includes('waterproofing') || nameLower.includes('alldry')) {
        return 'dd3f23a8-be2d-4ef9-9498-f52dd3e84906'; // Waterproofing
    }

    // 4. Wood & Metal Enamels
    if (catLower.includes('enamel') || catLower.includes('wood') || nameLower.includes('enamel') || nameLower.includes('sparkle') || nameLower.includes('allwood') || nameLower.includes('melamine')) {
        return 'bdf37d47-1c76-4cec-98b2-2c3188d6dbba'; // Wood & Metal Enamels
    }

    // 5. Exterior
    if (catLower.includes('exterior')) {
        return '35d3f48d-0cec-4163-9a50-7ff33be3fbb5'; // Exterior Weathercoats
    }

    // 6. Interior
    if (catLower.includes('interior')) {
        return 'd166b9c5-f021-4ea5-b9e3-f6ca08617e12'; // Interior Emulsions
    }

    // 7. Aerosol / Spray Paint
    if (catLower.includes('aerosol') || nameLower.includes('aero')) {
        return '150cea87-d17e-4fec-8260-bf7fe0c7364e'; // Others
    }

    return 'd166b9c5-f021-4ea5-b9e3-f6ca08617e12';
}

async function insertAllBirlaProducts() {
    console.log("🚀 Starting Birla Opus Database Ingestion Pipeline...");

    const jsonPath = path.join(__dirname, 'birla-opus-products.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error(`Catalog JSON not found at ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const productsData = JSON.parse(rawData);
    console.log(`📦 Loaded ${productsData.length} Birla Opus products from JSON.`);

    const conn = await mysql.createConnection(DB_URL);
    console.log("🔌 Connected to MySQL SaaS Database.");

    try {
        // 1. Verify store exists
        const [stores] = await conn.execute("SELECT id, name, slug FROM stores WHERE id = ?", [STORE_ID]);
        if (stores.length === 0) {
            throw new Error(`Store ID ${STORE_ID} not found in database!`);
        }
        console.log(`🏬 Targeting Store: "${stores[0].name}" (${stores[0].slug})`);

        // 2. Clean previous Birla Opus products (idempotent run)
        const [existing] = await conn.execute(
            "SELECT id FROM products WHERE store_id = ? AND brand = 'Birla Opus'",
            [STORE_ID]
        );
        if (existing.length > 0) {
            console.log(`🧹 Removing ${existing.length} existing Birla Opus products for clean re-insertion...`);
            const ids = existing.map(e => `'${e.id}'`).join(',');
            await conn.execute(`DELETE FROM product_variants WHERE product_id IN (${ids})`);
            await conn.execute(`DELETE FROM product_media WHERE product_id IN (${ids})`);
            await conn.execute(`DELETE FROM products WHERE id IN (${ids})`);
            console.log("   -> Cleaned successfully.");
        }

        let insertedProducts = 0;
        let insertedVariants = 0;
        let insertedMedia = 0;

        const seenSlugs = new Set();

        for (const item of productsData) {
            const categoryId = mapCategory(item);
            const categoryName = CATEGORY_NAMES[categoryId] || 'Premium Paint';

            let slug = item.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            if (seenSlugs.has(slug)) {
                slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
            }
            seenSlugs.add(slug);

            const productId = crypto.randomUUID();

            // Calculate basePrice
            let basePrice = "0.00";
            if (item.packSizes && item.packSizes.length > 0) {
                const prices = item.packSizes
                    .map(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0)
                    .filter(p => p > 0);
                if (prices.length > 0) {
                    basePrice = Math.min(...prices).toFixed(2);
                }
            }

            // Build Specifications
            const specifications = [
                { label: "Brand", value: "Birla Opus" },
                { label: "Category", value: categoryName }
            ];

            if (item.features && Array.isArray(item.features)) {
                item.features.forEach(f => {
                    if (f && f.trim()) {
                        specifications.push({ label: "Feature", value: f.trim() });
                    }
                });
            }

            specifications.push(
                { label: "Recommended Coats", value: "2 Coats" },
                { label: "Washability", value: "High (Stain Resistant)" }
            );

            // Insert into products table
            await conn.execute(`
                INSERT INTO products (
                    id, store_id, category_id, brand, name, slug, description,
                    base_price, discount_price, is_featured, is_archived, specifications,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 0, 0, ?, NOW(), NOW())
            `, [
                productId,
                STORE_ID,
                categoryId,
                'Birla Opus',
                item.name,
                slug,
                item.description || `${item.name} by Birla Opus offers superior durability, coverage, and lasting aesthetic finish.`,
                basePrice,
                JSON.stringify(specifications)
            ]);
            insertedProducts++;

            // Insert Media
            let mediaId = null;
            if (item.image) {
                mediaId = crypto.randomUUID();
                await conn.execute(`
                    INSERT INTO product_media (id, product_id, url, media_type, sort_order)
                    VALUES (?, ?, ?, 'image', 0)
                `, [mediaId, productId, item.image]);
                insertedMedia++;
            }

            // Insert Variants (pack sizes)
            if (item.packSizes && item.packSizes.length > 0) {
                for (const pack of item.packSizes) {
                    const variantId = crypto.randomUUID();
                    const cleanPrice = parseFloat(String(pack.price).replace(/[^0-9.]/g, '')) || parseFloat(basePrice) || 0;

                    await conn.execute(`
                        INSERT INTO product_variants (
                            id, product_id, title, sku, price_override, stock_quantity, image_id
                        ) VALUES (?, ?, ?, ?, ?, 100, ?)
                    `, [
                        variantId,
                        productId,
                        pack.volume || '1 L',
                        pack.sku || null,
                        cleanPrice.toFixed(2),
                        mediaId
                    ]);
                    insertedVariants++;
                }
            } else {
                const variantId = crypto.randomUUID();
                await conn.execute(`
                    INSERT INTO product_variants (
                        id, product_id, title, sku, price_override, stock_quantity, image_id
                    ) VALUES (?, ?, '1 L', NULL, ?, 100, ?)
                `, [variantId, productId, basePrice, mediaId]);
                insertedVariants++;
            }
        }

        console.log(`\n======================================================`);
        console.log(`🎉 SUCCESS! INGESTION COMPLETE:`);
        console.log(`   -> Products inserted: ${insertedProducts}`);
        console.log(`   -> Media records inserted: ${insertedMedia}`);
        console.log(`   -> Variants (pack sizes) inserted: ${insertedVariants}`);
        console.log(`======================================================\n`);

        // Check updated summary
        const [counts] = await conn.execute(`
            SELECT brand, COUNT(*) as count 
            FROM products 
            WHERE store_id = ? 
            GROUP BY brand
        `, [STORE_ID]);
        console.log("📊 Store Inventory Breakdown by Brand:");
        console.table(counts);

    } catch (err) {
        console.error("❌ Insertion Error:", err);
    } finally {
        await conn.end();
    }
}

insertAllBirlaProducts();

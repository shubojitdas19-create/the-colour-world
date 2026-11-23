const mysql = require('mysql2/promise');

async function checkCategoriesAndProducts() {
    const dbUrl = "mysql://cfacijgr_admin:Jstar%40890@66.116.227.244:3306/cfacijgr_saas";
    const storeId = "708e4612-0de8-4268-834f-dc6d0252eedf";

    const conn = await mysql.createConnection(dbUrl);

    // 1. Clean any trailing space in category names
    await conn.execute("UPDATE categories SET name = TRIM(name), slug = TRIM(slug) WHERE store_id = ?", [storeId]);

    // 2. Fetch all categories
    const [cats] = await conn.execute("SELECT id, name, slug FROM categories WHERE store_id = ? ORDER BY name ASC", [storeId]);
    console.log("Categories in DB:");
    console.table(cats);

    // 3. Check products count by category and brand
    const [counts] = await conn.execute(`
        SELECT 
            COALESCE(c.name, 'Uncategorized') as categoryName,
            COALESCE(c.slug, 'none') as categorySlug,
            p.brand,
            COUNT(*) as count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.store_id = ?
        GROUP BY c.name, c.slug, p.brand
        ORDER BY categoryName, p.brand
    `, [storeId]);

    console.log("\nProducts count by Category and Brand:");
    console.table(counts);

    await conn.end();
}

checkCategoriesAndProducts().catch(console.error);

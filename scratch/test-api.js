const axios = require('axios');

async function testApi() {
    const storeId = "708e4612-0de8-4268-834f-dc6d0252eedf";
    
    try {
        console.log("Testing default API call (no limit)...");
        const resDefault = await axios.get(`http://localhost:3000/api/storefront/products?storeId=${storeId}`);
        console.log("Default items returned:", resDefault.data?.data?.length);
        console.log("Pagination total:", resDefault.data?.pagination?.total);

        console.log("\nTesting with limit=500...");
        const res500 = await axios.get(`http://localhost:3000/api/storefront/products?storeId=${storeId}&limit=500`);
        console.log("Items returned with limit=500:", res500.data?.data?.length);

        const brandCounts = {};
        const catCounts = {};
        res500.data?.data?.forEach(p => {
            brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
            const cName = p.category?.name || 'Uncategorized';
            catCounts[cName] = (catCounts[cName] || 0) + 1;
        });
        console.log("Brand counts:", brandCounts);
        console.log("Category counts:", catCounts);

        // Test category filter
        console.log("\nTesting category filter: interior-emulsions...");
        const resCat = await axios.get(`http://localhost:3000/api/storefront/products?storeId=${storeId}&category=interior-emulsions&limit=500`);
        console.log("Interior Emulsions returned:", resCat.data?.data?.length);

    } catch (e) {
        console.error("API error:", e.message);
    }
}

testApi();

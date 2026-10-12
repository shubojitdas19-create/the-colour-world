const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchStorefront(endpoint: string, options?: RequestInit) {
  const storeId = process.env.STORE_ID;

  if (!storeId) {
    throw new Error("STORE_ID is missing from .env.local");
  }

  // Remove leading slash if accidentally provided in the component
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  
  // Check if the endpoint already has query parameters to append correctly
  const separator = cleanEndpoint.includes("?") ? "&" : "?";
  
  // Construct the final URL with the storeId attached automatically
  const url = `${BACKEND_URL}/api/storefront/${cleanEndpoint}${separator}storeId=${storeId}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Default cache for 60 seconds
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.success) {
      console.error(`API Error on ${cleanEndpoint}:`, json.error);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error(`Fetch failed for ${cleanEndpoint}:`, error);
    return null;
  }
}
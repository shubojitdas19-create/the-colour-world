"use server";

export async function submitOrderAction(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  items: { productId: string; quantity: number; price: number }[];
}) {
  try {
    // We send the order data to your saas-commerce backend API
    // Assuming your saas-commerce backend is running on localhost:3000
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/storefront/the-colour-world/checkout";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to process your order." };
    }

    return { success: true, orderNumber: data.orderNumber };
  } catch (error) {
    console.error("Checkout API Error:", error);
    return { success: false, error: "Failed to connect to the server. Please try again." };
  }
}
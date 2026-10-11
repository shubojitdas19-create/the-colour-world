"use server";

export async function submitConsultationAction(formData: FormData) {
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    message: formData.get("message"),
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/storefront/the-colour-world/leads";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return { success: false, error: "Failed to submit." };
    return { success: true };
  } catch (error) {
    return { success: false, error: "Server connection failed." };
  }
}
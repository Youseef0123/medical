export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    id: number | string;
    documentId?: string;
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead?: boolean;
    createdAt?: string;
  };
  errors?: Record<string, string>;
}

/**
 * Submits contact inquiry form data to Strapi backend API (POST /api/contact-uses).
 */
export async function submitContactForm(payload: ContactFormData): Promise<ContactFormResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${baseUrl}/api/contact-uses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ContactFormResponse = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to submit inquiry. Please check input values.",
        errors: data.errors,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: "Unable to connect to server. Please check your internet connection or try again later.",
      errors: { network: error?.message || "Network error" },
    };
  }
}

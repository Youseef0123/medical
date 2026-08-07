import type { Job } from "@/types";

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

export interface JobApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

/** Helper function to map Strapi job entry to frontend Job interface */
export function mapStrapiJob(raw: any): Job {
  const item = raw.attributes || raw;

  const mapList = (list: any): string[] => {
    if (!list) return [];
    if (Array.isArray(list)) {
      return list.map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object" && "text" in entry) return entry.text;
        return String(entry);
      });
    }
    return [];
  };

  return {
    id: String(raw.documentId || raw.id || item.documentId || item.id),
    slug: item.slug || `job-${raw.id || raw.documentId}`,
    title: item.title || "Job Opening",
    department: item.department || "General",
    location: item.location || "Cairo, Egypt",
    type: item.type || "Full-time",
    postedDate: item.createdAt ? item.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
    description: item.description || "",
    responsibilities: mapList(item.responsibilities),
    requirements: mapList(item.requirements),
  };
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

/**
 * Fetches open job postings directly from Strapi API (GET /api/jobs?filters[isOpen][$eq]=true&populate=*).
 * Returns ONLY data from the backend (no mock fallback).
 */
export async function fetchOpenJobs(): Promise<Job[]> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${baseUrl}/api/jobs?filters[isOpen][$eq]=true&populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Strapi fetchOpenJobs failed with status:", res.status);
      return [];
    }

    const json = await res.json();
    const rawList = json.data;

    if (Array.isArray(rawList)) {
      return rawList.map(mapStrapiJob);
    }

    return [];
  } catch (error) {
    console.warn("Strapi fetchOpenJobs network error:", error);
    return [];
  }
}

/**
 * Submits a job application with CV file attachment to Strapi backend API (POST /api/job-applications).
 */
export async function submitJobApplication(formData: FormData): Promise<JobApplicationResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${baseUrl}/api/job-applications`, {
      method: "POST",
      body: formData, // Browser sets multipart boundary automatically
    });

    const data: JobApplicationResponse = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to submit job application. Please check input values.",
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

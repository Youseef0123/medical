import type { EventCategory, EventItem, Job, Product } from "@/types";

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
  data?: unknown;
  errors?: Record<string, string>;
}

/**
 * Strapi base URL. NEXT_PUBLIC_* values are inlined at build time, so the env
 * var must be available during the build (not only at runtime).
 */
export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/+$/, "");

/** Helper function to map Strapi job entry to frontend Job interface */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Strapi payload shape varies (v4 attributes vs v5 flat)
export function mapStrapiJob(raw: any): Job {
  const item = raw.attributes || raw;

  const mapList = (list: unknown): string[] => {
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
  try {
    const res = await fetch(`${STRAPI_URL}/api/contact-uses`, {
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
  } catch (error) {
    return {
      success: false,
      message: "Unable to connect to server. Please check your internet connection or try again later.",
      errors: { network: error instanceof Error ? error.message : "Network error" },
    };
  }
}

/**
 * Fetches open job postings directly from Strapi API (GET /api/jobs?filters[isOpen][$eq]=true&populate=*).
 * Returns ONLY data from the backend (no mock fallback).
 */
export async function fetchOpenJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/jobs?filters[isOpen][$eq]=true&populate=*`, {
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
  try {
    const res = await fetch(`${STRAPI_URL}/api/job-applications`, {
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
  } catch (error) {
    return {
      success: false,
      message: "Unable to connect to server. Please check your internet connection or try again later.",
      errors: { network: error instanceof Error ? error.message : "Network error" },
    };
  }
}

/** Helper function to map Strapi product entry to frontend Product interface */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Strapi payload shape varies (v4 attributes vs v5 flat)
export function mapStrapiProduct(raw: any): Product {
  const item = raw.attributes || raw;

  let imageUrl: string | undefined = undefined;
  const imgData = item.image?.data?.attributes || item.image?.data || item.image;
  if (imgData?.url) {
    imageUrl = imgData.url.startsWith("http") ? imgData.url : `${STRAPI_URL}${imgData.url}`;
  } else if (typeof item.image === "string") {
    imageUrl = item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `${STRAPI_URL}${item.image}`;
  }

  const activeIngredient = item.activeIngredient || item.ingredient || "";
  const strength = item.strength || "";
  const packSize = item.packSize || "";
  const dosage = item.dosage || (strength && packSize ? `${strength} — ${packSize}` : strength || packSize || "");

  return {
    id: raw.id || raw.documentId,
    documentId: raw.documentId,
    slug: item.slug || `product-${raw.id || raw.documentId}`,
    name: item.name || "Pharmaceutical Product",
    ingredient: activeIngredient,
    activeIngredient,
    strength,
    packSize,
    dosage,
    category: item.category || "Neurology",
    type: item.type || "Prescription",
    description: item.shortDescription || item.description || "",
    image: imageUrl,
    isActive: item.isActive ?? true,
    featured: item.featured ?? false,
    displayOrder: item.displayOrder ?? 0,
  };
}

/**
 * Fetches active products directly from Strapi API (GET /api/products?filters[isActive][$eq]=true&populate=*&sort=displayOrder:asc).
 */
export async function fetchProducts(
  options: { featured?: boolean; limit?: number } = {}
): Promise<Product[]> {
  let query = "filters[isActive][$eq]=true&populate=*&sort=displayOrder:asc";
  if (options.featured) query += "&filters[featured][$eq]=true";
  if (options.limit) query += `&pagination[pageSize]=${options.limit}`;

  try {
    const res = await fetch(`${STRAPI_URL}/api/products?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Strapi fetchProducts failed with status:", res.status);
      return [];
    }

    const json = await res.json();
    const rawList = json.data;

    if (Array.isArray(rawList)) {
      return rawList.map(mapStrapiProduct);
    }

    return [];
  } catch (error) {
    console.warn("Strapi fetchProducts network error:", error);
    return [];
  }
}

/** Resolves a Strapi media object (v4 or v5 shape) to an absolute URL. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Strapi payload shape varies (v4 attributes vs v5 flat)
function toMediaUrl(media: any): string | undefined {
  const url: unknown = media?.attributes?.url ?? media?.url;
  if (typeof url !== "string" || !url) return undefined;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

/** Formats a Strapi `date` field (YYYY-MM-DD) as e.g. "January 15, 2026". */
function formatEventDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Helper function to map Strapi event entry to frontend EventItem interface */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Strapi payload shape varies (v4 attributes vs v5 flat)
export function mapStrapiEvent(raw: any): EventItem {
  const item = raw.attributes || raw;

  const coverImage = toMediaUrl(item.photo?.data ?? item.photo);
  const galleryRaw = item.gallery?.data ?? item.gallery;
  const gallery = (Array.isArray(galleryRaw) ? galleryRaw : [])
    .map(toMediaUrl)
    .filter((url): url is string => Boolean(url));

  return {
    id: String(raw.documentId || raw.id),
    title: item.title || "Medisave Event",
    category: (item.category || "Cycle Meeting") as EventCategory,
    description: item.description || "",
    date: formatEventDate(item.eventDate),
    location: item.location || undefined,
    coverImage,
    // Gallery photos drive the masonry grid; fall back to the cover photo
    images: gallery.length > 0 ? gallery : coverImage ? [coverImage] : [],
    featured: item.featured ?? false,
    displayOrder: item.displayOrder ?? 0,
  };
}

/**
 * Fetches events & news directly from Strapi API (GET /api/events?populate=*&sort=displayOrder:asc).
 * Returns ONLY data from the backend (no mock fallback).
 */
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/events?populate=*&sort[0]=displayOrder:asc&sort[1]=eventDate:desc&pagination[pageSize]=100`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("Strapi fetchEvents failed with status:", res.status);
      return [];
    }

    const json = await res.json();
    const rawList = json.data;

    if (Array.isArray(rawList)) {
      return rawList.map(mapStrapiEvent);
    }

    return [];
  } catch (error) {
    console.warn("Strapi fetchEvents network error:", error);
    return [];
  }
}

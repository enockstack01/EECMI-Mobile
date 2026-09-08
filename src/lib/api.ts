/**
 * Thin client for the EECMI backend (Express + MongoDB).
 *
 * Set `EXPO_PUBLIC_API_URL` in `.env` to point at a local server
 * (e.g. http://192.168.1.20:5000) during development. It falls back to the
 * deployed Render service.
 */

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'https://eecmi-platform.onrender.com'
).replace(/\/$/, '');

export type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.');
  }

  let body: ApiResult<T> | null = null;
  try {
    body = (await res.json()) as ApiResult<T>;
  } catch {
    // Non JSON response (e.g. Render cold start HTML) — fall through.
  }

  if (!res.ok || (body && body.success === false)) {
    throw new ApiError(body?.message ?? `Request failed (${res.status}).`, res.status);
  }

  return body ?? { success: true };
}

export { ApiError };

// --- Form submissions -------------------------------------------------------

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export function submitContact(input: ContactInput) {
  return request('/api/contact', { method: 'POST', body: JSON.stringify(input) });
}

export type PrayerInput = {
  name?: string;
  email?: string;
  request: string;
  isAnonymous?: boolean;
  isPublic?: boolean;
};

export function submitPrayer(input: PrayerInput) {
  return request('/api/prayer', { method: 'POST', body: JSON.stringify(input) });
}

export type VolunteerInput = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills?: string;
  areas?: string[];
  availability?: string;
  motivation?: string;
};

export function registerVolunteer(input: VolunteerInput) {
  return request('/api/volunteer', { method: 'POST', body: JSON.stringify(input) });
}

export type PartnerInput = {
  name: string;
  email: string;
  organization?: string;
  partnerType?: string;
  partnershipAreas?: string;
  message?: string;
};

export function submitPartner(input: PartnerInput) {
  return request('/api/partner', { method: 'POST', body: JSON.stringify(input) });
}

export function subscribeNewsletter(email: string) {
  return request('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// --- Reads -----------------------------------------------------------------

export type Resource = {
  id: string;
  title: string;
  type: string;
  description?: string;
  fileUrl?: string;
  externalUrl?: string;
  year?: string;
  downloads?: number;
};

export function getResources() {
  return request<Resource[]>('/api/resources', { method: 'GET' });
}

export type PublicPrayer = {
  id: string;
  name?: string;
  request: string;
  isAnonymous?: boolean;
  prayerCount?: number;
  createdAt?: string;
};

export function getPublicPrayers() {
  return request<PublicPrayer[]>('/api/prayer/public', { method: 'GET' });
}

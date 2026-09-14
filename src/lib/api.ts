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

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<ApiResult<T>> {
  const { token, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(rest.headers ?? {}),
      },
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

export { ApiError, request };

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

// --- Devotions -----------------------------------------------------------

export type Devotion = {
  id: string;
  title: string;
  series?: string;
  description?: string;
  scriptureRef?: string;
  body?: string;
  type: 'text' | 'pdf' | 'document' | 'audio' | 'video' | 'link';
  fileUrl?: string;
  externalUrl?: string;
  coverImageUrl?: string;
  author?: string;
  publishedAt?: string;
};

export function getDevotions() {
  return request<Devotion[]>('/api/devotions', { method: 'GET' });
}
export function getDevotion(id: string) {
  return request<Devotion>(`/api/devotions/${id}`, { method: 'GET' });
}
export function recordDevotionDownload(id: string) {
  return request(`/api/devotions/${id}/download`, { method: 'POST' }).catch(() => undefined);
}

// --- News & Updates ----------------------------------------------------

export type NewsPost = {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  readTime?: string;
  imageUrl?: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
};

export function getNews() {
  return request<NewsPost[]>('/api/news', { method: 'GET' });
}
export function getNewsPost(id: string) {
  return request<NewsPost>(`/api/news/${id}`, { method: 'GET' });
}

// --- Site content ----------------------------------------------------

export function getSiteContent() {
  return request<Record<string, unknown>>('/api/content', { method: 'GET' });
}

// --- Signed-in (token required) --------------------------------------

export type MeProfile = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: string;
  phone: string;
  location: string;
  interests: string[];
  notifyInApp: boolean;
};

export type ActivityItem = {
  kind: string;
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  type: 'update' | 'devotion' | 'system';
  title: string;
  body?: string;
  linkPath?: string;
  read: boolean;
  createdAt: string;
};

export const getMe = (token: string) => request<MeProfile>('/api/me', { method: 'GET', token });
export const patchMe = (token: string, body: Partial<Pick<MeProfile, 'phone' | 'location' | 'interests' | 'notifyInApp'>>) =>
  request<Partial<MeProfile>>('/api/me', { method: 'PATCH', token, body: JSON.stringify(body) });
export const getMyActivity = (token: string) => request<ActivityItem[]>('/api/me/activity', { method: 'GET', token });
export const getSavedDevotions = (token: string) => request<Devotion[]>('/api/me/devotions', { method: 'GET', token });
export const saveDevotion = (token: string, id: string) =>
  request<{ saved: boolean }>(`/api/me/devotions/${id}/save`, { method: 'POST', token });
export const unsaveDevotion = (token: string, id: string) =>
  request<{ saved: boolean }>(`/api/me/devotions/${id}/save`, { method: 'DELETE', token });

export const getNotifications = (token: string) =>
  request<AppNotification[]>('/api/notifications', { method: 'GET', token });
export const getUnreadCount = (token: string) =>
  request<{ count: number }>('/api/notifications/unread-count', { method: 'GET', token });
export const markNotificationsRead = (token: string, ids?: string[]) =>
  request('/api/notifications/read', { method: 'POST', token, body: JSON.stringify(ids ? { ids } : {}) });

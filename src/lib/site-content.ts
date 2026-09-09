/**
 * Admin-managed platform content. The app fetches GET /api/content and merges
 * it over the bundled `constants/content.ts` defaults, so screens always render
 * even offline / before the request resolves.
 */
import {
  AboutFacts as DefaultAboutFacts,
  Leadership as DefaultLeadership,
  Org as DefaultOrg,
  Programs as DefaultPrograms,
  Values as DefaultValues,
  Vision as DefaultVision,
  type Program,
} from '@/constants/content';
import { getSiteContent } from '@/lib/api';

// Semantic icon tokens from the server -> Ionicons names used on mobile.
const ICON_MAP: Record<string, string> = {
  prison: 'lock-closed',
  women: 'heart',
  children: 'happy',
  youth: 'trending-up',
  family: 'home',
  community: 'globe',
};

export type SiteContent = {
  org: typeof DefaultOrg;
  vision: typeof DefaultVision & { tagline?: string };
  values: typeof DefaultValues;
  aboutFacts: typeof DefaultAboutFacts;
  programs: Program[];
  leadership: typeof DefaultLeadership;
  stories: { name: string; role: string; program: string; story: string }[];
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  org: DefaultOrg,
  vision: DefaultVision,
  values: DefaultValues,
  aboutFacts: DefaultAboutFacts,
  programs: DefaultPrograms,
  leadership: DefaultLeadership,
  stories: [],
};

type RawProgram = Program & { icon?: string };

function normalize(raw: Record<string, unknown>): SiteContent {
  const merged = { ...DEFAULT_SITE_CONTENT, ...(raw as Partial<SiteContent>) };
  const programs = Array.isArray(raw.programs)
    ? (raw.programs as RawProgram[]).map((p) => ({
        ...p,
        icon: ICON_MAP[p.icon ?? ''] ?? p.icon ?? 'ellipse',
      }))
    : DEFAULT_SITE_CONTENT.programs;
  return { ...merged, programs };
}

let cache: SiteContent | null = null;
let inflight: Promise<SiteContent> | null = null;

export async function loadSiteContent(): Promise<SiteContent> {
  if (cache) return cache;
  if (!inflight) {
    inflight = getSiteContent()
      .then((res) => {
        cache = normalize((res.data ?? {}) as Record<string, unknown>);
        return cache;
      })
      .catch(() => DEFAULT_SITE_CONTENT)
      .finally(() => { inflight = null; });
  }
  return inflight;
}

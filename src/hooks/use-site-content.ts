import { useEffect, useState } from 'react';

import { DEFAULT_SITE_CONTENT, loadSiteContent, type SiteContent } from '@/lib/site-content';

/**
 * Returns the admin-managed platform content, starting from the bundled
 * defaults and swapping in the live values once GET /api/content resolves.
 */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let alive = true;
    loadSiteContent().then((c) => {
      if (alive) setContent(c);
    });
    return () => { alive = false; };
  }, []);

  return content;
}

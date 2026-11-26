/**
 * APP STAMP — lightweight "which code is this build running" fingerprint.
 *
 * WHY THIS EXISTS (root cause of the recurring "header options are not
 * working / login does nothing" reports): whenever source files change
 * under a long-lived browser tab (dev Fast Refresh, a dev-server restart,
 * or a production deploy), the tab can keep executing an old module graph
 * whose event handlers are bound to dead module instances. The UI renders
 * but clicks do nothing until the user manually reloads — every time.
 *
 * The stamp is the newest mtime across all source files plus the server
 * process id, cached server-side for a few seconds. Any code change or
 * server restart produces a different stamp; the client watchdog
 * (components/system/app-watchdog.tsx) compares its load-time stamp
 * against this endpoint and hard-reloads the stale shell automatically.
 */

import { promises as fs } from "fs";
import path from "path";

const CACHE_TTL_MS = 8_000;
const SOURCE_EXT = /\.(tsx?|css|json)$/;

let cache: { stamp: string; at: number } | null = null;
let inflight: Promise<string> | null = null;

async function computeStamp(): Promise<string> {
  const roots = [
    path.join(/*turbopackIgnore: true*/ process.cwd(), "src"),
    path.join(/*turbopackIgnore: true*/ process.cwd(), "next.config.ts"),
    path.join(/*turbopackIgnore: true*/ process.cwd(), "package.json"),
  ];
  let maxMtime = 0;
  const stack: string[] = [];
  for (const root of roots) stack.push(root);
  while (stack.length > 0) {
    const current = stack.pop() as string;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      // Single file (next.config.ts / package.json) or unreadable dir.
      try {
        const st = await fs.stat(current);
        if (st.mtimeMs > maxMtime) maxMtime = st.mtimeMs;
      } catch {
        // Ignore anything unreadable — the stamp is best-effort.
      }
      continue;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules") continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!SOURCE_EXT.test(entry.name)) continue;
      try {
        const st = await fs.stat(full);
        if (st.mtimeMs > maxMtime) maxMtime = st.mtimeMs;
      } catch {
        // Ignore unreadable entries.
      }
    }
  }
  // process.pid makes the stamp change on every dev-server restart even
  // when no file changed; Math.floor keeps the string stable per ms.
  return `${process.pid}:${Math.floor(maxMtime)}`;
}

export async function getAppStamp(): Promise<string> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.stamp;
  if (!inflight) {
    inflight = computeStamp()
      .then((stamp) => {
        cache = { stamp, at: Date.now() };
        return stamp;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

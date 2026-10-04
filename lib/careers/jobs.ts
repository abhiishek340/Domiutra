import type { Job } from "@/lib/data/types";

/**
 * Job listings adapter. Connect an ATS with two environment variables:
 *   ATS_PROVIDER = "greenhouse" | "lever" | "ashby"
 *   ATS_BOARD_ID = the public board token / company slug
 * Uses each provider's public job-board API (no secret key needed).
 * Returns [] when unconfigured or on error, so the page shows its empty state
 * instead of failing. Never returns sample jobs.
 */

type Fetcher = (board: string) => Promise<Job[]>;

const REVALIDATE_SECONDS = 3600;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`ATS request failed: ${res.status}`);
  return (await res.json()) as T;
}

const greenhouse: Fetcher = async (board) => {
  const data = await getJson<{
    jobs: { id: number; title: string; absolute_url: string; location?: { name?: string }; departments?: { name: string }[] }[];
  }>(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(board)}/jobs?content=true`);
  return data.jobs.map((j) => ({
    id: String(j.id),
    title: j.title,
    team: j.departments?.[0]?.name ?? "General",
    location: j.location?.name ?? "",
    type: "",
    url: j.absolute_url,
  }));
};

const lever: Fetcher = async (board) => {
  const data = await getJson<
    { id: string; text: string; hostedUrl: string; categories?: { team?: string; location?: string; commitment?: string } }[]
  >(`https://api.lever.co/v0/postings/${encodeURIComponent(board)}?mode=json`);
  return data.map((j) => ({
    id: j.id,
    title: j.text,
    team: j.categories?.team ?? "General",
    location: j.categories?.location ?? "",
    type: j.categories?.commitment ?? "",
    url: j.hostedUrl,
  }));
};

const ashby: Fetcher = async (board) => {
  const data = await getJson<{
    jobs: { id: string; title: string; jobUrl: string; department?: string; location?: string; employmentType?: string; isListed?: boolean }[];
  }>(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}`);
  return data.jobs
    .filter((j) => j.isListed !== false)
    .map((j) => ({
      id: j.id,
      title: j.title,
      team: j.department ?? "General",
      location: j.location ?? "",
      type: j.employmentType ?? "",
      url: j.jobUrl,
    }));
};

const providers: Record<string, Fetcher> = { greenhouse, lever, ashby };

export function isAtsConfigured(): boolean {
  const provider = process.env.ATS_PROVIDER?.trim().toLowerCase();
  return Boolean(provider && providers[provider] && process.env.ATS_BOARD_ID?.trim());
}

export async function getJobs(): Promise<Job[]> {
  const provider = process.env.ATS_PROVIDER?.trim().toLowerCase();
  const board = process.env.ATS_BOARD_ID?.trim();
  if (!provider || !board) return [];
  const fetcher = providers[provider];
  if (!fetcher) {
    console.warn(`[careers] Unknown ATS_PROVIDER "${provider}". Expected greenhouse, lever, or ashby.`);
    return [];
  }
  try {
    return await fetcher(board);
  } catch (error) {
    console.error("[careers] Failed to load jobs:", error);
    return [];
  }
}

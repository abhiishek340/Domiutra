import { afterEach, describe, expect, it, vi } from "vitest";
import { getJobs, isAtsConfigured } from "@/lib/careers/jobs";

function mockFetch(body: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("careers ATS adapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns no jobs (never sample jobs) when unconfigured", async () => {
    vi.stubEnv("ATS_PROVIDER", "");
    vi.stubEnv("ATS_BOARD_ID", "");
    const fetchMock = mockFetch({});
    expect(isAtsConfigured()).toBe(false);
    await expect(getJobs()).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores unknown providers with a warning", async () => {
    vi.stubEnv("ATS_PROVIDER", "workday");
    vi.stubEnv("ATS_BOARD_ID", "acme");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(isAtsConfigured()).toBe(false);
    await expect(getJobs()).resolves.toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it("maps Greenhouse postings", async () => {
    vi.stubEnv("ATS_PROVIDER", "Greenhouse");
    vi.stubEnv("ATS_BOARD_ID", "domiutra");
    const fetchMock = mockFetch({
      jobs: [{ id: 7, title: "Senior Engineer", absolute_url: "https://gh/7", location: { name: "Remote" }, departments: [{ name: "Engineering" }] }],
    });
    expect(isAtsConfigured()).toBe(true);
    await expect(getJobs()).resolves.toEqual([
      { id: "7", title: "Senior Engineer", team: "Engineering", location: "Remote", type: "", url: "https://gh/7" },
    ]);
    expect(fetchMock.mock.calls[0]![0]).toContain("boards-api.greenhouse.io/v1/boards/domiutra/jobs");
  });

  it("maps Lever postings with defaults for missing fields", async () => {
    vi.stubEnv("ATS_PROVIDER", "lever");
    vi.stubEnv("ATS_BOARD_ID", "domiutra");
    mockFetch([{ id: "a", text: "QA Engineer", hostedUrl: "https://lever/a", categories: { commitment: "Full-time" } }]);
    await expect(getJobs()).resolves.toEqual([
      { id: "a", title: "QA Engineer", team: "General", location: "", type: "Full-time", url: "https://lever/a" },
    ]);
  });

  it("maps Ashby postings and hides unlisted ones", async () => {
    vi.stubEnv("ATS_PROVIDER", "ashby");
    vi.stubEnv("ATS_BOARD_ID", "domiutra");
    mockFetch({
      jobs: [
        { id: "1", title: "SRE", jobUrl: "https://ashby/1", department: "Ops", location: "NYC", employmentType: "FullTime" },
        { id: "2", title: "Hidden", jobUrl: "https://ashby/2", isListed: false },
      ],
    });
    const jobs = await getJobs();
    expect(jobs.map((j) => j.title)).toEqual(["SRE"]);
  });

  it("degrades to an empty list when the ATS is down", async () => {
    vi.stubEnv("ATS_PROVIDER", "greenhouse");
    vi.stubEnv("ATS_BOARD_ID", "domiutra");
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch({}, false);
    await expect(getJobs()).resolves.toEqual([]);
  });
});

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Domiutra collects, uses, and protects information submitted through this website.",
  path: "/privacy",
});

export default function Page() {
  return <LegalPage slug="privacy" path="/privacy" />;
}

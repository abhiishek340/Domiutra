import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement",
  description: "Domiutra's commitment to an accessible website, the measures we take, and how to report a barrier.",
  path: "/accessibility",
});

export default function Page() {
  return <LegalPage slug="accessibility" path="/accessibility" />;
}

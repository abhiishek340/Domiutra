import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "The terms that govern use of the Domiutra website.",
  path: "/terms",
});

export default function Page() {
  return <LegalPage slug="terms" path="/terms" />;
}

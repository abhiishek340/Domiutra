import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { WorkflowSection } from "@/components/sections/home/WorkflowSection";
import { WhySection } from "@/components/sections/home/WhySection";
import { IndustriesSection } from "@/components/sections/home/IndustriesSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Domiutra: U.S.-Managed Engineering, Cloud, AI & Managed Services",
  absoluteTitle: true,
  description:
    "Domiutra helps U.S. companies build, modernize, and operate technology: software engineering, application modernization, cloud and DevOps, AI and data, and managed services through U.S.-managed global delivery teams.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <WorkflowSection />
      <WhySection />
      <IndustriesSection />
      <FinalCTA title="Let’s build what’s next." body="Tell us what you’re working on." />
    </>
  );
}

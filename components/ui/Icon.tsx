import {
  Activity,
  BrainCircuit,
  Briefcase,
  Cloud,
  CodeXml,
  Cpu,
  Factory,
  FlaskConical,
  Gauge,
  HeartPulse,
  Landmark,
  Layers,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Users,
  Workflow,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/data/types";

const map = {
  code: CodeXml,
  refresh: RefreshCcw,
  cloud: Cloud,
  brain: BrainCircuit,
  activity: Activity,
  flask: FlaskConical,
  landmark: Landmark,
  heart: HeartPulse,
  factory: Factory,
  cpu: Cpu,
  truck: Truck,
  briefcase: Briefcase,
  shield: ShieldCheck,
  workflow: Workflow,
  users: Users,
  layers: Layers,
  gauge: Gauge,
} satisfies Record<IconName, unknown>;

/** Maps data-level icon names to Lucide components (decorative by default). */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden="true" strokeWidth={1.5} {...props} />;
}

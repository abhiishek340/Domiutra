import type { Service } from "@/lib/data/types";
import { diagramDetails } from "@/lib/data/diagram-details";
import { StepFlow } from "./StepFlow";
import { LifecycleLoop } from "./LifecycleLoop";

/** Chooses the right diagram form for a service. */
export function ServiceDiagram({ service }: { service: Service }) {
  const { key, steps, title } = service.diagram;
  if (key === "operations") return <LifecycleLoop steps={steps} />;
  return <StepFlow steps={steps} details={diagramDetails[key]} label={title} />;
}

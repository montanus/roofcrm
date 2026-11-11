import PipelineBoard from "@/app/components/PipelineBoard";
import { toPipelineFilters, type RawSearchParams } from "@/app/lib/searchParams";

const PRODUCTION_STAGES = [
  "Signed",
  "Permiting",
  "Ordering",
  "In Progress",
  "Inspection",
  "Balance Due",
] as const;

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return <PipelineBoard stages={PRODUCTION_STAGES} searchParams={toPipelineFilters(await searchParams)} />;
}

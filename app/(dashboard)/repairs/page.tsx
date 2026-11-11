import PipelineBoard from "@/app/components/PipelineBoard";
import { toPipelineFilters, type RawSearchParams } from "@/app/lib/searchParams";

const REPAIRS_STAGES = ["Repairs", "Punch List", "Done", "No Sale"] as const;

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return <PipelineBoard stages={REPAIRS_STAGES} searchParams={toPipelineFilters(await searchParams)} />;
}

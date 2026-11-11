import PipelineBoard from "@/app/components/PipelineBoard";
import { toPipelineFilters, type RawSearchParams } from "@/app/lib/searchParams";

const SALES_STAGES = ["Calls", "Lead", "Internet", "Needs Quote", "Has Quote", "Signed"] as const;

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return <PipelineBoard stages={SALES_STAGES} searchParams={toPipelineFilters(await searchParams)} />;
}

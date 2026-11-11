import PipelineBoard from "@/app/components/PipelineBoard";
import { toPipelineFilters, type RawSearchParams } from "@/app/lib/searchParams";

const B2B_STAGES = ["B2B"] as const;

export default async function B2BPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return <PipelineBoard stages={B2B_STAGES} searchParams={toPipelineFilters(await searchParams)} />;
}

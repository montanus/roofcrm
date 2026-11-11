export type RawSearchParams = { [key: string]: string | string[] | undefined };

export function toPipelineFilters(searchParams: RawSearchParams) {
  const asString = (value: string | string[] | undefined) =>
    typeof value === "string" ? value : undefined;

  return {
    stage: asString(searchParams.stage),
    rep: asString(searchParams.rep),
    q: asString(searchParams.q),
  };
}

import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { getCustomers } from "@/app/db/queries/customers";
import { getNotesByCustomerIds } from "@/app/db/queries/notes";
import CustomerCard from "./CustomerCard";
import CustomerFormDialog from "./CustomerFormDialog";
import PipelineFilters from "./PipelineFilters";

const currency = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default async function PipelineBoard({
  stages,
  searchParams,
}: {
  stages: readonly string[];
  searchParams: { stage?: string; rep?: string; q?: string };
}) {
  const allCustomers = await getCustomers();

  // Scope this board to its own stages, so search never leaks in customers
  // that belong to a different pipeline (e.g. Production showing up on Repairs).
  let filtered = allCustomers.filter((c) => stages.includes(c.stage));

  if (searchParams.stage) {
    filtered = filtered.filter((c) => c.stage === searchParams.stage);
  }
  if (searchParams.rep) {
    filtered = filtered.filter((c) => c.salesperson === searchParams.rep);
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    filtered = filtered.filter(
      (c) => c.last.toLowerCase().includes(q) || c.first.toLowerCase().includes(q)
    );
  }

  const notesByCustomer = await getNotesByCustomerIds(filtered.map((c) => c.id));

  const sumStage = (stage: string) =>
    filtered
      .filter((c) => c.stage === stage)
      .reduce((total, c) => total + Number(c.price ?? 0), 0);

  return (
    <>
      <Grid container spacing={4} sx={{ p: 4 }} alignItems="center">
        <Grid size={{ lg: 2, sm: 4, xs: 12 }}>
          <CustomerFormDialog trigger="button" />
        </Grid>
        <Grid size={{ lg: 10, sm: 8, xs: 12 }}>
          <PipelineFilters />
        </Grid>
      </Grid>

      {!searchParams.q ? (
        <Grid container spacing={4} sx={{ p: 4 }}>
          {stages.map((stage) => (
            <Grid key={stage} size={{ lg: 2, sm: 12 }}>
              <Grid container justifyContent="center" sx={{ background: "#414559", color: "white" }}>
                <Typography sx={{ padding: "1", fontWeight: "bold" }}>
                  {stage} {currency(sumStage(stage))}
                </Typography>
              </Grid>
              {filtered
                .filter((c) => c.stage === stage)
                .map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    notes={notesByCustomer.get(customer.id) ?? []}
                  />
                ))}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4} sx={{ p: 4 }}>
          <Grid size={{ lg: 2, sm: 12 }}>
            {filtered.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                notes={notesByCustomer.get(customer.id) ?? []}
              />
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
}

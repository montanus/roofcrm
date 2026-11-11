"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid2";
import { Input, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { jobStages, salesReps } from "@/app/lib/constants";

export default function PipelineFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ lg: 3, sm: 4, xs: 12 }}>
        <Input
          fullWidth
          type="text"
          placeholder="Search..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
        />
      </Grid>
      <Grid size={{ lg: 2, sm: 4, xs: 6 }}>
        <Select
          fullWidth
          value={searchParams.get("stage") ?? "all"}
          onChange={(e: SelectChangeEvent) => setParam("stage", e.target.value)}
        >
          <MenuItem value="all">All stages</MenuItem>
          {jobStages.map((stage) => (
            <MenuItem key={stage} value={stage}>
              {stage}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={{ lg: 2, sm: 4, xs: 6 }}>
        <Select
          fullWidth
          value={searchParams.get("rep") ?? "all"}
          onChange={(e: SelectChangeEvent) => setParam("rep", e.target.value)}
        >
          <MenuItem value="all">All reps</MenuItem>
          {salesReps.map((rep) => (
            <MenuItem key={rep} value={rep}>
              {rep}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
}

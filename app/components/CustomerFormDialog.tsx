"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Grid from "@mui/material/Grid2";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { saveCustomer, type CustomerActionState } from "@/app/actions/customers";
import { jobStages, jobTypes, salesReps } from "@/app/lib/constants";
import type { Customer } from "@/app/db/schema";

const initialState: CustomerActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" color="primary" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export default function CustomerFormDialog({
  customer,
  trigger = "icon",
}: {
  customer?: Customer;
  trigger?: "icon" | "button";
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, formAction] = useActionState(saveCustomer, initialState);

  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  return (
    <>
      {trigger === "icon" ? (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ color: (theme) => theme.palette.secondary.main }}
        >
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ color: (theme) => theme.palette.primary.contrastText }}
        >
          Add
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form action={formAction} key={formKey}>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogContent>
            <input type="hidden" name="id" defaultValue={customer?.id ?? ""} />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={6}>
                <TextField name="first" label="First" defaultValue={customer?.first ?? ""} fullWidth required />
              </Grid>
              <Grid size={6}>
                <TextField name="last" label="Last" defaultValue={customer?.last ?? ""} fullWidth required />
              </Grid>
              <Grid size={12}>
                <TextField name="address" label="Address" defaultValue={customer?.address ?? ""} fullWidth />
              </Grid>
              <Grid size={6}>
                <TextField name="phone" label="Phone" defaultValue={customer?.phone ?? ""} fullWidth />
              </Grid>
              <Grid size={6}>
                <TextField name="email" label="Email" defaultValue={customer?.email ?? ""} fullWidth />
              </Grid>
              <Grid size={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  defaultValue={customer?.price ?? "0"}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  name="sortorder"
                  label="Priority"
                  select
                  slotProps={{ select: { native: true } }}
                  defaultValue={customer?.sortorder ?? "5"}
                  fullWidth
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  name="stage"
                  label="Stage"
                  select
                  slotProps={{ select: { native: true } }}
                  defaultValue={customer?.stage ?? jobStages[0]}
                  fullWidth
                  required
                >
                  {jobStages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  name="jobType"
                  label="Job Type"
                  select
                  slotProps={{ select: { native: true } }}
                  defaultValue={customer?.jobType ?? jobTypes[0]}
                  fullWidth
                  required
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  name="salesperson"
                  label="Sales Rep"
                  select
                  slotProps={{ select: { native: true } }}
                  defaultValue={customer?.salesperson ?? salesReps[0]}
                  fullWidth
                  required
                >
                  {salesReps.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  name="notes"
                  label="Comments"
                  defaultValue={customer?.notes ?? ""}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid size={12}>
                <TextField name="gdrive" label="Docs link" defaultValue={customer?.gdrive ?? ""} fullWidth />
              </Grid>
            </Grid>
            {state.status === "error" && (
              <p style={{ color: "#f44336", marginTop: 8 }}>{state.message}</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: (theme) => theme.palette.secondary.contrastText }}>
              Cancel
            </Button>
            <SubmitButton />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

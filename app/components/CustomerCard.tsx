"use client";

import Grid from "@mui/material/Grid2";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import DocIcon from "@mui/icons-material/Source";
import LocationOn from "@mui/icons-material/LocationOn";
import CustomerFormDialog from "./CustomerFormDialog";
import CustomerNotesDialog from "./CustomerNotesDialog";
import MoveToNoSaleButton from "./MoveToNoSaleButton";
import type { Customer, Note } from "@/app/db/schema";

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CustomerCard({
  customer,
  notes,
}: {
  customer: Customer;
  notes: Note[];
}) {
  const latestNote = notes[0];

  return (
    <div style={{ margin: "3%" }}>
      <Card sx={{ minWidth: 200, p: 1, background: "#1e2025" }}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: "bold" }}>
                {formatDate(customer.createdAt)}
              </Typography>
            </Grid>
            <Grid size={10}>
              <Typography variant="h5" color="white" sx={{ fontWeight: "bold" }}>
                {customer.last}
              </Typography>
              <Typography variant="body1" color="white" sx={{ fontWeight: "bold" }}>
                {customer.first}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
                {customer.sortorder?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid size={12} container direction="column">
              {customer.jobType} - {customer.notes}
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: "bold" }}>
                <a href={`tel:${customer.phone}`}>{customer.phone}</a>
              </Typography>
            </Grid>
            {customer.email ? (
              <Grid size={12}>
                <Typography variant="body2" color="white">
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </Typography>
              </Grid>
            ) : null}
            <Grid size={12}>
              <Typography variant="body2" color="text.primary">
                {Number(customer.price ?? 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: "bold" }}>
                {customer.address}
              </Typography>
            </Grid>
            <Grid size={11}>
              <Typography variant="body2" color="white" sx={{ fontWeight: "bold" }}>
                {latestNote?.createdAt ? new Date(latestNote.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}{" "}
                {latestNote?.content}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="body2" color="white" sx={{ fontWeight: "bold" }}>
                {customer.salesperson}
              </Typography>
            </Grid>
            <Grid size={2}>
              <a href={`https://maps.google.com/?q=${customer.address}`} target="_blank" rel="noreferrer">
                <LocationOn />
              </a>
            </Grid>
            <Grid size={2}>
              <CustomerNotesDialog customer={customer} notes={notes} />
            </Grid>
            <Grid size={2}>
              {customer.gdrive ? (
                <a href={customer.gdrive} target="_blank" rel="noreferrer">
                  <DocIcon sx={{ color: (theme) => theme.palette.secondary.main }} />
                </a>
              ) : null}
            </Grid>
            {customer.stage === "Internet" ? (
              <Grid size={1}>
                <MoveToNoSaleButton customerId={customer.id} />
              </Grid>
            ) : null}
            <Grid size={1}>
              <CustomerFormDialog customer={customer} trigger="icon" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { markCustomerNoSale } from "@/app/actions/customers";

export default function MoveToNoSaleButton({ customerId }: { customerId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await markCustomerNoSale(customerId);
      setOpen(false);
    });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: (theme) => theme.palette.secondary.main }}>
        <DeleteOutlineIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Move to No Sale?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This moves the contact out of Internet and into No Sale. You can change the
            stage back manually from the edit dialog if needed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" disabled={pending}>
            {pending ? "Moving..." : "Move to No Sale"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

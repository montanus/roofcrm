"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import Grid from "@mui/material/Grid2";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/Add";
import { deleteNote, saveNote, type NoteActionState } from "@/app/actions/notes";
import type { Customer, Note } from "@/app/db/schema";

const initialState: NoteActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" color="primary" disabled={pending}>
      {pending ? "Saving..." : "Add Note"}
    </Button>
  );
}

function DeleteNoteButton({ noteId }: { noteId: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button size="small" disabled={pending} onClick={() => startTransition(() => deleteNote(noteId))}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export default function CustomerNotesDialog({
  customer,
  notes,
}: {
  customer: Customer;
  notes: Note[];
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, formAction] = useActionState(saveNote, initialState);

  useEffect(() => {
    if (state.status === "success") {
      setFormKey((k) => k + 1);
    }
  }, [state]);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: (theme) => theme.palette.secondary.main }}>
        <NoteAddIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Notes — {customer.first} {customer.last}
        </DialogTitle>
        <DialogContent>
          {notes.length > 0 ? (
            notes.map((n) => (
              <Card key={n.noteId} variant="outlined" sx={{ mb: 1.5 }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {n.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container width="100%" spacing={1} alignItems="center">
                    <Grid size={9}>
                      <Typography variant="subtitle2">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                      </Typography>
                    </Grid>
                    <Grid size={3}>
                      <DeleteNoteButton noteId={n.noteId} />
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              No notes yet.
            </Typography>
          )}

          <form action={formAction} key={formKey}>
            <input type="hidden" name="customerId" value={customer.id} />
            <TextField
              name="content"
              label="New note"
              fullWidth
              multiline
              minRows={2}
              required
              sx={{ mt: 1 }}
            />
            {state.status === "error" && (
              <p style={{ color: "#f44336", marginTop: 8 }}>{state.message}</p>
            )}
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpen(false)} sx={{ color: (theme) => theme.palette.secondary.contrastText }}>
                Close
              </Button>
              <SubmitButton />
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

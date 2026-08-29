// components/UserModal.tsx
import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid2";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Typography, CardActionArea, CardActions } from '@mui/material';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/material-renderers';
import { customerSchema, customerUiSchema } from '../schemas/customerSchema';
import { User } from './Main';
import { VerticalLayout, ControlElement } from '@jsonforms/core/lib/models/uischema';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: any) => void;
  user?: any;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState<User>();
  const [notes, setNotes] = useState<any[]>([]);

  const handleSubmit = () => {
    onSubmit(formData); // Send data to parent component
    onClose(); // Close the modal  
  };

  useEffect(() => {
    fetchNotes()
  }, [user]);

  const fetchNotes = async () => {
    if (!user && !user?.id) return;
    const response = await fetch('/api/notes/'+user.id);
    const data = await response.json();
    setNotes(data);
  };

  const handleDelete = async (noteId: string) => {
    await fetch('/api/notes/', { method: 'DELETE', body: JSON.stringify({ note_id: noteId }),
  });
    fetchNotes(); // Refresh notes after deletion

  };

  const uischema: any = {
    type: "VerticalLayout",
    elements: [
      { type: "Control", scope: "#/properties/content", options: { multi: true } }
    ]
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>notes</DialogTitle>
      <DialogContent>
            <Card variant="outlined" style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                      comments
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user?.notes ? user.notes : 'No commments'}
                      </Typography>
                    </CardContent>
                  </Card>
        {notes && notes.length > 0 ? (
          <div>
            <h3>User Notes</h3>
            <ul>
     

              {notes.map((note: any, index: number) => (
                <Card key={index} variant="outlined" style={{ marginBottom: '10px' }}>
                  <CardContent>
                   
                    <Typography variant="body2" color="textSecondary">
                      {note.content}
                    </Typography>
                  </CardContent>
                <CardActions>
                  <Grid width={'100%'} container spacing={1}>
                    <Grid size={10}>
                      <Typography variant="subtitle2" component="div">
                        {note?.created_at ? new Date(note.created_at).toLocaleString() : ''} 
                        </Typography>
                      </Grid>
                      <Grid size={2}>
                        <Button size="small" onClick={() => handleDelete(note.note_id)}>Delete</Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              ))}
            </ul>
          </div>
        ) : (
          <p>No notes available for this user.</p>
        )}

        <JsonForms
          schema={{
            type: "object",
            properties: {
              title: { type: "string",  title: "Tile" },
              content:  { type: "string", title: "Notes", default: "No Notes" },
        
            },
            required: ["content"]
          }}
          uischema={uischema}
          data={formData}
          renderers={materialRenderers}
          onChange={({ data }) => setFormData(data)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}
          sx={{ color: (theme) => theme.palette.secondary.contrastText }}
        >Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;

// components/UserModal.tsx
import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid2";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Typography, CardActionArea, CardActions } from '@mui/material';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/material-renderers';
import { User } from './Main';

const uischema: any = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/contract_price", options: { multi: true } },
    { type: "Control", scope: "#/properties/job_desc", options: { multi: true } }
  ]
};

const schema: any = {
  type: "object",
  properties: {
    job_desc: { type: "string",  title: "Description" },
    contract_price:  { type: "number", title: "Price", default: 0 },

  },
  required: ["contract_price", "job_desc"]
};



interface JobProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: any) => void;
  user?: any;
}

const JobModal: React.FC<JobProps> = ({ open, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState<User>();
  const [jobs, setJobs] = useState<any[]>([]);

  const handleSubmit = () => {
    onSubmit(formData); // Send data to parent component
    onClose(); // Close the modal  
  };

  useEffect(() => {
    fetchJobs()
  }, [user]);

  const fetchJobs = async () => {
    if (!user && !user?.id) return;
    const response = await fetch('/api/jobs/'+user.id);
    const data = await response.json();
    setJobs(data);
  };

  const handleDelete = async (noteId: string) => {
    await fetch('/api/jobs/', { method: 'DELETE', body: JSON.stringify({ note_id: noteId }),
  });
  fetchJobs(); // Refresh notes after deletion

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
        {jobs && jobs.length > 0 ? (
          <div>
            <h3>Customer Jobs</h3>
            <ul>
     

              {jobs.map((job: any, index: number) => (
                <Card key={index} variant="outlined" style={{ marginBottom: '10px' }}>
                  <CardContent>
                   
                    <Typography variant="body2" color="textSecondary">
                      {job.job_desc}
                    </Typography>
                  </CardContent>
                <CardActions>
                  <Grid width={'100%'} container spacing={1}>
                    <Grid size={10}>
                      <Typography variant="subtitle2" component="div">
                        {job?.created_at ? new Date(job.created_at).toLocaleString() : ''} 
                        </Typography>
                      </Grid>
                      <Grid size={2}>
                        <Button size="small" onClick={() => handleDelete(job.id)}>Delete</Button>
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
          schema={schema}
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

export default JobModal;

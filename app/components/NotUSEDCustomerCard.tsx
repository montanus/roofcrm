import { Avatar, Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Edit from "@mui/icons-material/Edit";
import Doc from "@mui/icons-material/Source";
import Add from "@mui/icons-material/Add";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Note, User } from "./Main";
import { use, useState } from "react";
import CustomerNotes from "./customerNotes";
import CustomerModal from "./customerModal";
import JobModal from "./Jobs";

const UserCard = ({ user, notes, handleAddOrUpdateUser }: { user: User, notes: any[], handleAddOrUpdateUser: (user: any) => Promise<void> }) => {
  const [openNotes, setOpenNotes] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [selectedUserNotes, setSelectedUserNotes] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);




    const handleOpenJob = (user: User) => {
      setOpenJobs(true);
    };

    const handleCloseJob = () => {
      setOpenJobs(false);
    };
    
    const handleAddOrUpdateJob = async (user: Note) => {
      try {
        const response = await fetch(`/api/jobs`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Failed to update user");
        return await response.json();
      } catch (err) {
        console.error("Error updating user:", err);
        return null;
      }
    };

    const handleOpenNotes = (user: User) => {
        setOpenNotes(true);
      };

      const handleCloseNotes = () => {
        setOpenNotes(false);
      };
      
      const updateNote = async (user: Note) => {
        try {
          const response = await fetch(`/api/notes`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });
          if (!response.ok) throw new Error("Failed to update user");
          return await response.json();
        } catch (err) {
          console.error("Error updating user:", err);
          return null;
        }
      };

      const handleAddOrUpdateNotes = async (notes: Note) => {
        const payload = {...notes, customer_id: parseInt(user.id)}
        if (notes.note_id) {
          const updatedUser = await updateNote(payload);
          // if (updatedUser) {
          //   setData((prev) =>
          //     prev.map((u) => (u.id === notes.id ? updatedUser : u))
          //   );
          // }
        } else {
          console.log(payload)
          const newUser = await postNote(payload);
        }
        handleCloseNotes();
      };

      const postNote = async (note: Note) => {
        try {
          const response = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
          });
          if (!response.ok) throw new Error("Failed to add user");
          return await response.json();
        } catch (err) {
          console.error("Error posting user:", err);
          return null;
        }
      };

    const latestNote = notes
      .filter((n) => n.customer_id === parseInt(user.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((note) => note)[0]
      
   //______________________________
   const handleOpen = (user = null) => {
        setOpen(true);
    };



    return (
    <div style={{ margin: "3%" }}>
      <Card sx={{ minWidth: 200, p: 1, background: "#1e2025"}}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid size={3}> 
              <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main  }}>            
                {user.last && user.last.charAt(0)}
              </Avatar>
            </Grid>
            <Grid size={7}>
              <Typography variant="h5" color="white" sx={{ fontWeight: 'bold' }}>
                {user.last}
              </Typography>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                {user.first}
              </Typography>
            </Grid>
            <Grid size={2} container direction="column" alignItems="flex-end">
              <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
              {user.stage}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {user.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            </Grid>
            <Grid size={7}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                <a href={`tel:${user.phone}`}> {user.phone}</a>
              </Typography>
            </Grid>
            <Grid size={5}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                 {user.jobType}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>{user.address}</Typography>
            </Grid>
            <Grid size={11}>
              <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                {latestNote?.created_at ? new Date(latestNote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} {latestNote?.content}
              </Typography>
            </Grid>
            <Grid size={4}>
            <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                {user.salesperson}
              </Typography>
            </Grid>

            <Grid size={2}>
              <a href={`https://maps.google.com/?q=${user.address}`} target="_blank">                
                  <LocationOnIcon />
                </a>
            </Grid>
            <Grid size={2}>
              <IconButton 
                onClick={() => handleOpenNotes(user)} 
              color="primary"
              sx={{ color: (theme) => theme.palette.secondary.main }} // Change color from the theme
>
                <Add />
              </IconButton>
            </Grid>
            <Grid size={2}>
              <a href={user.gdrive} target="_blank">
                <IconButton color="primary"
                                sx={{ color: (theme) => theme.palette.secondary.main }} // Change color from the theme
                >
                  <Doc />
                </IconButton>
              </a>
            </Grid>
            <Grid size={1}>
                <IconButton
                onClick={() => handleOpen(user)} // Open modal for editing
                color="primary"
                sx={{ color: (theme) => theme.palette.secondary.main }} // Change color from the theme
                >
                <Edit />
                </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CustomerNotes
          open={openNotes}
          onClose={handleCloseNotes}
          onSubmit={handleAddOrUpdateNotes}
          user={selectedUserNotes} // Pass selected user for editing
        />
      <CustomerModal
        open={open}
        onClose={handleClose}
        onSubmit={handleAddOrUpdateUser}
        user={user} // Pass selected user for editing
      />
      <JobModal
        open={open}
        onClose={handleCloseJob}
        onSubmit={handleAddOrUpdateJob}
        user={user} // Pass selected user for editing
      />
    </div>
  )};

export default UserCard;
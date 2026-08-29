"use client";

import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import React from "react";
import Button from "@mui/material/Button";
import CustomerModal from "./customerModal";
import EditCustomerModal from "./EditCustomerModal";
import { Icon, IconButton, Input, MenuItem, Select } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Doc from "@mui/icons-material/Source";
import Add from "@mui/icons-material/Add";
import CustomerNotes from "./customerNotes";
import JobModal from "./Jobs";
import LocationOn from "@mui/icons-material/LocationOn";
import { User, Note } from "@/app/types";

interface MainProps {
    tabsOptions: string[];

  }
const Main: React.FC<MainProps> = ({   tabsOptions
}) => {

  const [data, setData] = useState<any[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store the user being edited
  const [stage, setStage] = useState<string>("all");
  const [salesPersonFilter, setSalesPersonFilter] = useState<string>("all");
  
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // New state for search term
  const [openNotes, setOpenNotes] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [selectedUserNotes, setSelectedUserNotes] = useState<User | null>(null);





  const handleOpenJob = (user: User) => {
    setOpenJobs(true);
  };

  const handleCloseJob = () => {
    setOpenJobs(false);
  };
  
  const handleAddOrUpdateJob = async (user: User) => {
    alert("handleAddOrUpdateJob")
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
    setSelectedUserNotes(user);
    setOpenNotes(true);
  };

  const handleCloseNotes = () => {
    setOpenNotes(false);
  };
  
  useEffect(() => {
    let filtered = data;
    try {
      if (stage !== "all") {
        filtered = filtered.filter((user) => user.stage === stage);
      }
      if (salesPersonFilter !== "all") {
        filtered = filtered.filter((user) => user.salesperson === salesPersonFilter);
      }

      if (searchTerm) {
        filtered = filtered.filter((user) => {
          if(user.last)
            return user.last.toLowerCase().includes(searchTerm.toLowerCase()) || user.first.toLowerCase().includes(searchTerm.toLowerCase());
        }
        );
      }
    } catch (err) {
      alert("something went wrong, but we caught it")
    }

    setFilteredData(filtered);
  }, [stage, searchTerm, data, salesPersonFilter]);
  
  const handleFilter = (e: any) => {
    setStage(e.target.value);
  };

  const handleSalesPersonFilter = (e: any) => {
    setSalesPersonFilter(e.target.value);
  };

  const handleOpen = (user = null) => {
    setSelectedUser(user); // Set user for editing or null for adding new
    setOpen(true);
  };
  const handleOpenEditCustomer = (user = null) => {
    setSelectedUser(user); // Set user for editing or null for adding new
    setOpenEditCustomer(true);
  };

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      const sortedData = jsonData.sort((a: User, b: User) => {
        try {
          const sortDiff = parseInt(a.sortorder?.toString() || "0") - parseInt(b.sortorder?.toString() || "0")
          if (sortDiff !== 0) return sortDiff;
         
        } catch (err) {
        }


        if (a.last > b.last) return 1;
        if (a.last < b.last) return -1;

        return 0;
      });
       
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      setNotes(jsonData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateUser = async (user: any) => {
    console.log("handleAddOrUpdateUser", user);
    if (user.id) {
      const updatedUser = await updateUser(user);
      if (updatedUser) {
        setData((prev) =>
          prev.map((u) => (u.id === user.id ? updatedUser : u))
        );
      }
    } else {
      const newUser = await postUser(user);
      if (newUser) setData((prev) => [...prev, newUser]);
    }
    handleClose();
    fetchData();
  };

  const handleAddOrUpdateNotes = async (notes: Note) => {
    const payload = {...notes, customer_id: parseInt(selectedUserNotes.id)}
    if (notes.note_id) {
      await updateNote(payload);

    } else {
      console.log(payload)
      const newUser = await postNote(payload);
      if (newUser) setData((prev) => [...prev, newUser]);
    }
    handleCloseNotes();
    fetchNotes();
  };
  
  
  const handleDeleteUser = async (id: string) => {
    const success = await deleteUser(id);
    if (success) setData((prev) => prev.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchNotes();
    fetchData();
  }, []);

  const postUser = async (user: User) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Failed to add user");
      return await response.json();
    } catch (err) {
      console.error("Error posting user:", err);
      return null;
    }
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


  const updateUser = async (user: User) => {
    try {
      const response = await fetch(`/api/users`, {
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

  const deleteUser = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return false;
    try {
      const response = await fetch(`/api/users`, {
        method: "DELETE",
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      return false;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  const sumStage = (stage: string) => filteredData.filter((u) => u.stage === stage).reduce((total, user) => total + parseFloat(user.price), 0);


  const UserCard = ({ user }: { user: User }) => {
    const note = notes
      .filter((n) => n.customer_id === parseInt(user.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((note) => note)[0]
      
  function formatDate(created_at: Date | string): string {
    if (!created_at) return "";
    const date = new Date(created_at);
    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return formatted;
  }

  return (
    <div style={{ margin: "3%" }}>
      <Card sx={{ minWidth: 200, p: 1, background: "#1e2025"}}>
        <CardContent>
          
          <Grid container spacing={1}>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>{formatDate(user.created_at)}</Typography>
            </Grid>
            <Grid size={10}>
              <Typography variant="h5" color="white" sx={{ fontWeight: 'bold' }}>
                {user.last}
              </Typography>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                {user.first}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main  }}>            
                {user.sortorder && user.sortorder.charAt(0)}
              </Avatar>
            </Grid>
           <Grid size={12} container direction="column" >
              {user.jobType} - {user.notes}
             </Grid>
             <Grid size={8}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                <a href={`tel:${user.phone}`}> {user.phone}</a>
              </Typography>
            </Grid>
            <Grid size={4}>
            <Typography variant="body2" color="text.primary">
                {user.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>{user.address}</Typography>
            </Grid>
            <Grid size={11}>
              <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                {note?.created_at ? new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} {note?.content}
              </Typography>
            </Grid>
            <Grid size={4}>
            <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                {user.salesperson}
              </Typography>
            </Grid>
            <Grid size={2}>
            <a href={`https://maps.google.com/?q=${user.address}`} target="_blank">                
                  <LocationOn />
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
                onClick={() => handleOpenEditCustomer(user)} // Open modal for editing
                color="primary"
                sx={{ color: (theme) => theme.palette.secondary.main }} // Change color from the theme
                >
                <Edit />
                </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )};

  return (
    <>
      <Grid container spacing={4} sx={{ p: 4 }}>
        <Grid size={{ lg: 1, sm: 1 }}>
            <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()} // Open modal for adding new user
            sx={{ color: (theme) => theme.palette.primary.contrastText }} // Use theme palette for font color
            >
            Add
            </Button>
        </Grid>

        <Grid size={{ lg: 2, sm: 2 }}>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        <Grid size={{ lg: 1, sm: 1 }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={stage}
            label="stage"
            defaultValue="all"
            onChange={handleFilter}
          >
            <MenuItem value={"all"}>all</MenuItem>
            <MenuItem value={"Lead"}>Leads</MenuItem>
            <MenuItem value={"Calls"}>Calls</MenuItem>
            <MenuItem value={"Calls"}>Needs Quote</MenuItem>
            <MenuItem value={"Has Quote"}>Has Quote</MenuItem>
            <MenuItem value={"Repairs"}>Repairs</MenuItem>
            <MenuItem value={"Punch List"}>Punch List</MenuItem>
            <MenuItem value={"Ellington"}>Ellington</MenuItem>
          </Select>
        </Grid>
        <Grid size={{ lg: 1, sm: 1 }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={salesPersonFilter}
            label="stage"
            defaultValue="all"
            onChange={handleSalesPersonFilter}
          >
            <MenuItem value={"all"}>all</MenuItem>
            <MenuItem value={"Michael"}>Michael</MenuItem>
            <MenuItem value={"Conley"}>Conley</MenuItem>
            <MenuItem value={"Hall"}>Hall</MenuItem>
            <MenuItem value={"Chris"}>Chris</MenuItem>
            <MenuItem value={"Doug"}>Doug</MenuItem>
            <MenuItem value={"John"}>John</MenuItem>
          </Select>
        </Grid>
      </Grid>
      { !searchTerm ? (
    <Grid container spacing={4} sx={{ p: 4 }}>
        { tabsOptions.map( item => (
          <Grid size={{ lg: 2, sm: 12 }}>
            <Grid
              container
              justifyContent="center"
              sx={{ background: "#414559", color: "white" }}
            >
              <Typography sx={{padding: '1', fontWeight: "bold"}}>{item} {sumStage(item).toLocaleString('en-US', { color: 'green', style: 'currency', currency: 'USD',    minimumFractionDigits: 0,  maximumFractionDigits: 0 })}</Typography>
            </Grid>
            {filteredData
              .filter((u) => u.stage === item)
              .map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
          </Grid>
        ))}
        
       
      </Grid>
      ) : (
        <Grid container spacing={4} sx={{ p: 4 }}>

           <Grid size={{ lg: 2, sm: 12 }}>
          
          {filteredData
            .map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
           </Grid>
           </Grid>
          )}

      <JobModal
        open={openJobs}
        onClose={handleCloseJob}
        onSubmit={handleAddOrUpdateJob}
        user={selectedUser} // Pass selected user for editing
      />


      <CustomerModal
        open={open}
        onClose={handleClose}
        onSubmit={handleAddOrUpdateUser}
        user={selectedUser} // Pass selected user for editing
      />

      <EditCustomerModal
        open={openEditCustomer}
        onClose={() => setOpenEditCustomer(false)}
        onSubmit={handleAddOrUpdateUser}
        user={selectedUser} // Pass selected user for editing
      />

      <CustomerNotes
          open={openNotes}
          onClose={handleCloseNotes}
          onSubmit={handleAddOrUpdateNotes}
          user={selectedUserNotes} // Pass selected user for editing
        />
    </>
  );
}

export default Main;
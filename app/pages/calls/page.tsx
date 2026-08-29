"use client";


import { useEffect, useState } from 'react';
import React from 'react';

import { IconButton,  } from '@mui/material';
import { User } from '../../components/Main';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Edit from '@mui/icons-material/Edit';
import CustomerModal from '../../components/customerModal';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store the user being edited

  const handleOpen = (user = null) => {
    setSelectedUser(user); // Set user for editing or null for adding new
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Network response was not ok');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const calls: User[] = data.filter(user => user.stage ==="Call").map((user) => ({
    const calls: User[] = data.filter(user => user.stage === "Calls").map((user) => ({
      id: user.id,
    first: user.first,
    last: user.last,
    address: user.address,
    phone: user.phone,
    email: user.email,
    jobType: user.jobType,
    price: user.price,
    stage: user.stage,
    notes: user.notes,
  }));


  useEffect(() => {

    fetchData();
  }, []);
  const updateUser = async (user: User) => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (err) {
      console.error('Error updating user:', err);
      return null;
    }
  };
  const handleAddOrUpdateUser = async (user: any) => {
    console.log("handleAddOrUpdateUser",user);
      const updatedUser = await updateUser(user);
      if (updatedUser) {
        setData((prev) =>
          prev.map((u) => (u.id === user.id ? updatedUser : u))
        );
      }
   
    handleClose();
    fetchData();
  };
  return (
    <>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Last</TableCell>
            <TableCell align="right">First</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calls.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
            <TableCell component="th" scope="row">

            <IconButton
              onClick={() => handleOpen(row)} // Open modal for editing
              color="primary"
            >
              <Edit />
            </IconButton>
          </TableCell>

              <TableCell align="right">
                {row.last}
              </TableCell>
              <TableCell align="right">{row.first}</TableCell>
              <TableCell align="right"> <a href={`tel:${row.phone}`}> {row.phone}</a></TableCell>
              <TableCell align="right">{row.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <CustomerModal
          open={open}
          onClose={handleClose}
          onSubmit={handleAddOrUpdateUser}
          user={selectedUser} // Pass selected user for editing
        />
    </>
  );
}

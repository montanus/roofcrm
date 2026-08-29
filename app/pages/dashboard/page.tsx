"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Link, Typography } from '@mui/material';
import CustomerModal from '../../components/customerModal';
import { User } from '../../components/Main';


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


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'first', headerName: 'First', width: 130 },
    { field: 'last', headerName: 'Last', width: 130 },
    { field: 'address', headerName: 'Address', width: 130 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'jobType', headerName: 'Job Type', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'stage', headerName: 'Stage', width: 130 },
    { field: 'notes', headerName: 'Notes', width: 130 },
  ];
  

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
  const rows1: GridRowsProp = data.filter(user => user.stage ==="Lead").map((user) => ({
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

  const rows2: GridRowsProp = data.filter(u => u.stage ==="Has Quote").map((user) => ({
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

  const rows3: GridRowsProp = data.filter(u => u.stage ==="Signed").map((user) => ({
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

  const handleCellClick = (d,e,na) => {
    setSelectedUser(data.filter(user => user.id === d.row.id)[0]); // Set user for editing or null for adding new
    setOpen(true);
  }

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
      <div style={{ width: '100%' }}>

      <Typography variant="h6">New Lead</Typography>
        <DataGrid  onCellClick={handleCellClick} rows={rows1} columns={columns} />
      <Typography variant="h6">Has Quote</Typography>
        <DataGrid onCellClick={handleCellClick} rows={rows2} columns={columns} />
      <Typography variant="h6">Signed</Typography>

       <DataGrid onCellClick={handleCellClick} rows={rows3} columns={columns} />
      </div>
      <CustomerModal
          open={open}
          onClose={handleClose}
          onSubmit={handleAddOrUpdateUser}
          user={selectedUser} // Pass selected user for editing
        />
    </>
  );
}

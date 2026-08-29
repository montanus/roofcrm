"use server";


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
import EditCustomerModal from '@/app/components/EditCustomerModal';

import { getAllUsers } from '@/app/actions/userActions';


export default async function Home() {

  const userData = await getAllUsers();

    
  function formatDate(created_at: Date | string): string {
    if (!created_at) return "";
    const date = new Date(created_at);
    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return formatted;
  } 

  return (
    <>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Count Id</TableCell>
            <TableCell align="right">Last</TableCell>
            <TableCell align="right">Last</TableCell>
            <TableCell align="right">First</TableCell>
            <TableCell align="right">Stage</TableCell>
            <TableCell align="right">Price</TableCell>

            <TableCell align="right">Job Type</TableCell>
            <TableCell align="right">Rep</TableCell>
            <TableCell align="right">EMail</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
            <TableCell component="th" scope="row">

     
          </TableCell>
              <TableCell align="right">
                {index + 1}
              </TableCell>
              <TableCell align="right">
                {formatDate(row.created_at)}
              </TableCell>
              <TableCell align="right">
                {row.last}
              </TableCell>
              <TableCell align="right">{row.first}</TableCell>
              <TableCell align="right">{row.stage}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.jobType}</TableCell>
              <TableCell align="right">{row.salesperson}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right"> <a href={`tel:${row.phone}`}> {row.phone}</a></TableCell>
              <TableCell align="right">{row.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {/* <EditCustomerModal
          open={open}
          onClose={handleClose}
          onSubmit={handleAddOrUpdateUser}
          user={selectedUser} // Pass selected user for editing
        />
        */}
    </> 
  );
}


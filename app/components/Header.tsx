import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" ><Button color="inherit">Sales</Button></Link>
          <Link href="/pages/production" ><Button color="inherit">Prod</Button></Link>
          <Link href="/pages/repairs" ><Button color="inherit">Punch</Button></Link>
          <Link href="/pages/b2b" ><Button color="inherit">B2B</Button></Link>
          {/* <Link href="/pages/dashboard" ><Button color="inherit">Pipeline</Button></Link>
          <Link href="/pages/calls" ><Button color="inherit">Calls</Button></Link>
          <Link href="/pages/leads" ><Button color="inherit">Leads</Button></Link>
          <Link href="/pages/punchlist" ><Button color="inherit">Oscar</Button></Link> */}

        </Toolbar>
      </AppBar>
    </Box>
  );
}
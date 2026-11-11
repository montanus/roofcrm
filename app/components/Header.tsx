import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/">
            <Button color="inherit">Sales</Button>
          </Link>
          <Link href="/production">
            <Button color="inherit">Prod</Button>
          </Link>
          <Link href="/repairs">
            <Button color="inherit">Punch</Button>
          </Link>
          <Link href="/b2b">
            <Button color="inherit">B2B</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

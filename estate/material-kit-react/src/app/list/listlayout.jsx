import React from 'react';
import Navbar from "../list/estate-nav";
import Sidebar from "../list/estate-sidebar";
import { Grid, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box display="flex">
        <Sidebar />
        <Box flexGrow={1}>
          
        </Box>
      </Box>
    </>
  );

};

export default Layout;

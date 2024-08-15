"use client";
import React from 'react';

import EstateList from '../../list/estate-list';
import Navbar from "../../list/estate-nav";
import Sidebar from "../../list/estate-sidebar";
import { Box } from '@mui/material';
import { useState } from 'react';



export default function HomePage() {

  const [filter, setFilter] = useState<string | null>(null);


  const handleFilterChange = (statusId:string) => {
    setFilter(statusId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar onFilterChange={handleFilterChange} />
        <Box sx={{ flex: 1, padding: 2 }}>
          <EstateList />
        </Box>

      </div>
    </div>
  );
}

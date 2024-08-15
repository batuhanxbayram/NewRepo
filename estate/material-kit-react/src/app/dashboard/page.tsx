"use client";
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-estate';
import { Traffic } from '@/components/dashboard/overview/traffic';
import axios from 'axios';
import { useState } from 'react';
import '../../translate/i18n';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function Page(): React.JSX.Element {

  const [totalEstate, setTotalEstate] = useState<string>('');
  const [totalUser, setTotalUser] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const role = localStorage.getItem("role");
  const router = useRouter();


  if (!role || (role !== 'admin')) {
    router.push('/unauthorized');// Yetkisiz sayfasına yönlendirme
  }



  React.useEffect(() => {
    const fetchCount = async () => {
      try {
        const totalEstateresponse = await axios.get('http://localhost:5224/api/Estate/count');
        setTotalEstate(totalEstateresponse.data);
        const totalUserresponse = await axios.get("http://localhost:5224/api/Auth/count");
        setTotalUser(totalUserresponse.data);
        const avaragePricereponse = await axios.get("http://localhost:5224/api/Estate/averagePrice");
        setAveragePrice(avaragePricereponse.data);
      } catch (error) {
        console.error('Error fetching estate statuses:', error);
      }
    };

    fetchCount();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid lg={4} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={totalUser} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={totalEstate} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={averagePrice.toFixed(0)} />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <Traffic sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}

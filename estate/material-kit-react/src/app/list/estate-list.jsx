"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import BasicCard from '../list/estate-card';  // BasicCard bileşenini içe aktarıyoruz
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTranslation } from 'react-i18next'; // i18n'den useTranslation'ı içe aktarıyoruz
import '../../translate/i18n';

export default function EstateList() {
  const { t } = useTranslation(); // useTranslation kullanarak t fonksiyonunu alıyoruz
  const [estates, setEstates] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [isAscending] = useState(false);

  // Token'ı al
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5224/api/Estate/pages?currentPage=${currentPage}&pageSize=${pageSize}&isAscending=${isAscending}&typeId=${selectedType}&statusId=${selectedStatus}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data && response.data.estates) {
          setEstates(response.data.estates);
          setTotalCount(response.data.totalCount);
          console.log(response.data.estates);
        } else {
          console.error('Yanıt beklenen veri yapısına sahip değil:', response.data);
        }
      })
      .catch(error => {
        console.error('Emlak verileri çekilirken hata oluştu!', error);
      });
  }, [currentPage, pageSize, selectedType, selectedStatus, isAscending, token]);

  useEffect(() => {
    axios.get('http://localhost:5224/api/EstateType/list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setTypes(response.data);
      })
      .catch(error => {
        console.error('Emlak tipleri çekilirken hata oluştu!', error);
      });

    axios.get('http://localhost:5224/api/EstateStatus/list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setStatuses(response.data);
      })
      .catch(error => {
        console.error('Emlak durumları çekilirken hata oluştu!', error);
      });
  }, [token]);

  const handlePageChange = (event, value) => {
    console.log("değişti", value);
    setCurrentPage(value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>{t('typeSelect')}</InputLabel>
          <Select
            value={selectedType}
            onChange={handleTypeChange}
            label={t('typeSelect')}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>{t('statusSelect')}</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label={t('statusSelect')}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {estates.length > 0 ? estates.map((estate, index) => (
          <Box key={index} sx={{ flex: '1 0 48%', boxSizing: 'border-box', padding: 2 }}>
            <BasicCard
              estate={estate}
              estateType={types.find(type => type.id === estate.typeId)?.name || t('unknownType')}
              estateStatus={statuses.find(status => status.id === estate.statusId)?.name || t('unknownStatus')}
            />
          </Box>
        )) : <Typography variant="body1" color="text.secondary">{t('noEstates')}</Typography>}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil(totalCount / pageSize)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

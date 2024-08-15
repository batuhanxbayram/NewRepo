import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, List, ListItem, Typography, Divider, Collapse } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

import '../../translate/i18n'
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export default function Sidebar({ onFilterChange }) {
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    axios.get('http://localhost:5224/api/EstateStatus/list')
      .then(response => setStatuses(response.data))
      .catch(error => console.error('Status verileri çekilirken hata oluştu!', error));

    axios.get('http://localhost:5224/api/EstateType/list')
      .then(response => setTypes(response.data))
      .catch(error => console.error('Type verileri çekilirken hata oluştu!', error));
  }, []);

  const handleStatusClick = (statusId) => {
    setActiveFilter(statusId);
    onFilterChange(statusId);
    setShowAllStatuses(true);
    setOpenStatus(true);
  };

  const handleTypeClick = (typeId) => {
    setActiveFilter(typeId);
    onFilterChange(typeId);
    setShowAllTypes(true);
    setOpenType(true);
  };

  const toggleStatus = () => {
    setOpenStatus(!openStatus);
    setShowAllStatuses(!showAllStatuses);
  };

  const toggleType = () => {
    setOpenType(!openType);
    setShowAllTypes(!showAllTypes);
  };

  return (
    <Box
      sx={{
        width: 250,
        padding: 2,
        backgroundColor: '#f4f4f4',  // Açık gri arka plan rengi
        borderRight: '1px solid #ddd', // Sağ kenar çizgisi
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Sağ kenarda hafif gölge
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {t('estate')}
        </Typography>
      <List sx={{ padding: 0 }}>
        <ListItem button onClick={toggleStatus} sx={{ borderBottom: '1px solid #ddd' }}>
          <Typography variant="body1">{t('emlakdurumları')}</Typography>
          {openStatus ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openStatus} timeout="auto" unmountOnExit>
          <List>
            {(showAllStatuses ? statuses : statuses.slice(0, 3)).map(status => (
              <ListItem
                button
                key={status.id}
                onClick={() => handleStatusClick(status.id)}
                sx={{
                  padding: '10px 15px',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',  // Hover rengi
                  },
                }}
              >
                {status.name}
              </ListItem>
            ))}
            {statuses.length > 3 && !showAllStatuses && (
              <ListItem button onClick={toggleStatus} sx={{ padding: '10px 15px' }}>
                Daha Fazla
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{t('tür')}</Typography>
      <List sx={{ padding: 0 }}>
        <ListItem button onClick={toggleType} sx={{ borderBottom: '1px solid #ddd' }}>
          <Typography variant="body1">{t('tip')}</Typography>
          {openType ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openType} timeout="auto" unmountOnExit>
          <List>
            {(showAllTypes ? types : types.slice(0, 3)).map(type => (
              <ListItem
                button
                key={type.id}
                onClick={() => handleTypeClick(type.id)}
                sx={{
                  padding: '10px 15px',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',  // Hover rengi
                  },
                }}
              >
                {type.name}
              </ListItem>
            ))}
            {types.length > 3 && !showAllTypes && (
              <ListItem button onClick={toggleType} sx={{ padding: '10px 15px' }}>
                Daha Fazla
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Actions</Typography>
      <Link
        href="/map" passHref legacyBehavior
      >
        <Button
          variant="outlined"
          startIcon={<MapIcon />}
          fullWidth
          sx={{ mb: 1, borderColor: '#ddd', color: '#333', '&:hover': { borderColor: '#999', color: '#000' } }}
          >
          Harita Görünümü
        </Button>
      </Link>

      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        fullWidth
        sx={{ borderColor: '#ddd', color: '#333', '&:hover': { borderColor: '#999', color: '#000' } }}
      >
        Filtreleme Ekranı
      </Button>
    </Box>
  );
}

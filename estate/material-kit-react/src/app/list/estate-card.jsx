"use client";
import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Favorite } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import '../../translate/i18n';
import Link from 'next/link';

export default function BasicCard({ estate, estateType, estateStatus }) {
  const { t } = useTranslation();

  function getPhotoId(photoPath) {
    const segments = photoPath.split('\\');
    const fileName = segments[segments.length - 1];
    return fileName;
  }

  const estateImage = estate.photos && estate.photos.length > 0
    ? `http://localhost:5224/estate_photos/${getPhotoId(estate.photos[0])}`
    : 'https://via.placeholder.com/345x194';

  return (
    <Card
      sx={{
        maxWidth: 500,
        width: '100%',
        borderRadius: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 470,
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={estateImage}
        alt={estateType}
      />
      <CardContent sx={{ p: 2, flex: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {t('typecard')}: {t(estateType)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('statuscard')}: {t(estateStatus)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('startdate')}:
          {new Date(estate.startDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('enddate')}:
          {new Date(estate.endDate).toLocaleDateString()}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
          {t('currencycard')}: {estate.price.toLocaleString()} TL
        </Typography>

        {/* IconButton ve Button hizalaması */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <IconButton aria-label="add to favorites">
            <Favorite />
          </IconButton>
          <Link href={`/detail/${estate.id}`} passHref legacyBehavior>
            <Button variant="contained" color="inherit">
              {t("goDetail")}
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

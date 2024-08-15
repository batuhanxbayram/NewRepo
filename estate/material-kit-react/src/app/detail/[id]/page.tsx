"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Card, CardMedia, CardContent, List, ListItem, ListItemText, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import Link from 'next/link';
import '../../../translate/i18n';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

interface Estate {
  typeId: string;
  type: string | null;
  statusId: string;
  status: string | null;
  startDate: string;
  endDate: string;
  photos: string[];
  price: number;
  currencyId: string;
  currency: string | null;
  createdBy: string;
  geoX: number;
  geoY: number;
  id: string;
  isDeleted: boolean;
}

interface EstateDetailProps {
  params: {
    id: string;
  };
}

function getPhotoId(photoPath: string) {
  const segments = photoPath.split('\\'); // Windows dosya yolunu bölmek için
  const fileName = segments[segments.length - 1]; // Dosya adını alıyoruz (\\'den sonrasının tamamı)
  return fileName;
}

const EstateDetail: React.FC<EstateDetailProps> = ({ params }) => {
  const { id } = params;
  const [estate, setEstate] = useState<Estate | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5224/api/Estate/${id}`)
        .then(response => {
          setEstate(response.data);
        })
        .catch(error => {
          console.error('Estate API isteğinde bir hata oluştu:', error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (estate) {
      axios.get(`http://localhost:5224/api/EstateStatus/${estate.statusId}`)
        .then(response => {
          setStatus(response.data.name); // Gelen verinin ismini alıyoruz
        })
        .catch(error => {
          console.error('EstateStatus API isteğinde bir hata oluştu:', error);
        });

      axios.get(`http://localhost:5224/api/EstateType/${estate.typeId}`)
        .then(response => {
          setType(response.data.name); // Gelen verinin ismini alıyoruz
        })
        .catch(error => {
          console.error('EstateType API isteğinde bir hata oluştu:', error);
        });
    }
  }, [estate]);

  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!estate) {
    return <Typography>Veri yükleniyor...</Typography>;
  }

  const estateImage = estate.photos && estate.photos.length > 0
    ? `http://localhost:5224/estate_photos/${getPhotoId(estate.photos[0])}`
    : 'https://via.placeholder.com/345x194';

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Link href="/list" passHref legacyBehavior>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'auto',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {t('backHome')}
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={estateImage}
              alt="Emlak Görseli"
              onClick={() => handlePhotoClick(estate.photos[0])}
              sx={{ cursor: 'pointer' }}
            />
            <CardContent>
              <Grid container spacing={1}>
                {estate.photos.map((photo, index) => (
                  <Grid item xs={4} key={index}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={`http://localhost:5224/estate_photos/${getPhotoId(photo)}`}
                      alt={`Emlak Fotoğraf ${index + 1}`}
                      onClick={() => handlePhotoClick(photo)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Emlak Detayları
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Fiyat" secondary={`${estate.price} TL`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Başlangıç Tarihi" secondary={new Date(estate.startDate).toLocaleDateString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Bitiş Tarihi" secondary={new Date(estate.endDate).toLocaleDateString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Durum" secondary={status || "Belirtilmemiş"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tip" secondary={type || "Belirtilmemiş"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Konum" secondary={`(${estate.geoX}, ${estate.geoY})`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            image={selectedPhoto ? `http://localhost:5224/estate_photos/${getPhotoId(selectedPhoto)}` : ''}
            alt="Büyük Emlak Görseli"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EstateDetail;

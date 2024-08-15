"use client";
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/'); 
  };

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h3" color="error" gutterBottom>
          Yetkisiz Erişim
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bu sayfaya erişim izniniz yok.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Anasayfaya Dön
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;

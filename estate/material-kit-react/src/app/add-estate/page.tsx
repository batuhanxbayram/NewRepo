"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UploadPhotoForm from '../errors/not-found/page';
import Navbar from '../list/estate-nav';

interface Option {
  id: string;
  name: string;
  symbol?: string;
}

interface FormData {
  estateTypeId: string;
  estateStatusId: string;
  estateCurrencyId: string;
  startDate: string;
  endDate: string;
  price: number;
  geoX: number;
  geoY: number;
  createdBy: number;
  photos: string[]; // Fotoğraf URL'leri için yeni alan
}

const EstateForm: React.FC = () => {
  const [types, setTypes] = useState<Option[]>([]);
  const [statuses, setStatuses] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    estateTypeId: '',
    estateStatusId: '',
    estateCurrencyId: '',
    startDate: '',
    endDate: '',
    price: 0,
    geoX: 0,
    geoY: 0,
    createdBy: 0,
    photos: [] // Başlangıçta boş fotoğraf dizisi
  });

  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const typesResponse = await axios.get<Option[]>('http://localhost:5224/api/EstateType/list');
        const statusesResponse = await axios.get<Option[]>('http://localhost:5224/api/EstateStatus/list');
        const currenciesResponse = await axios.get<Option[]>('http://localhost:5224/api/EstateCurrency/list');

        setTypes(typesResponse.data);
        setStatuses(statusesResponse.data);
        setCurrencies(currenciesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Tarayıcı ortamında localStorage'a erişebilirsiniz
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as keyof FormData]: value as string | number,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    alert("Lütfen en az bir fotoğraf yükleyin.");

    try {
      const response = await axios.post('http://localhost:5224/api/Estate', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        alert('Mülk başarıyla eklendi!');
        router.push('/list');
      } else {
        console.log(response.data);
        alert('Mülk eklenirken hata oluştu.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Mülk eklenirken hata oluştu.');
    }
  };

  return (

    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
        maxWidth: 400,
        mx: 'auto',
        backgroundColor: '#f9f9f9'
      }}
    >

      <Typography variant="h6" gutterBottom>
        Yeni Mülk Ekle
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="estateType-label">Mülk Türü</InputLabel>
            <Select
              labelId="estateType-label"
              id="estateType"
              name="estateTypeId"
              value={formData.estateTypeId}
              onChange={handleChange}
              required
            >
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="estateStatus-label">Mülk Durumu</InputLabel>
            <Select
              labelId="estateStatus-label"
              id="estateStatus"
              name="estateStatusId"
              value={formData.estateStatusId}
              onChange={handleChange}
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="estateCurrency-label">Para Birimi</InputLabel>
            <Select
              labelId="estateCurrency-label"
              id="estateCurrency"
              name="estateCurrencyId"
              value={formData.estateCurrencyId}
              onChange={handleChange}
              required
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="startDate"
            label="Başlangıç Tarihi"
            name="startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="endDate"
            label="Bitiş Tarihi"
            name="endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="price"
            label="Fiyat"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="geoX"
            label="Geo X"
            name="geoX"
            type="number"
            value={formData.geoX}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="geoY"
            label="Geo Y"
            name="geoY"
            type="number"
            value={formData.geoY}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          console.log(photos)
          <UploadPhotoForm setPhotos={(photos) => setFormData({ ...formData, photos })} />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Ekle
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstateForm;

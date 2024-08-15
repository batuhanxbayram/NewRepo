"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography, TextField, IconButton, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import Navbar from '../list/estate-nav';
import { t } from 'i18next';
import '../../translate/i18n';

// Estate ve diğer tipleri tanımlayalım
interface Estate {
    id: string;
    type: {
        name: string;
        id: string;
        isDeleted: boolean;
    };
    status: {
        name: string;
        id: string;
        isDeleted: boolean;
    };
    price: number;
    currency: {
        name: string;
        symbol: string;
        id: string;
        isDeleted: boolean;
    };
    startDate: string;
    endDate: string;
    geoX?: number;
    geoY?: number;
    userId: string;
    isDeleted: boolean;
}

interface Type {
    name: string;
    id: string;
    isDeleted: boolean;
}

interface Status {
    name: string;
    id: string;
    isDeleted: boolean;
}

interface Currency {
    name: string;
    symbol: string;
    id: string;
    isDeleted: boolean;
}

// Material-UI stil bileşeni
const StyledCard = styled(Card)({
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    transition: '0.3s',
    '&:hover': {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
});

const StyledCardContent = styled(CardContent)({
    padding: '16px',
});

const StyledButton = styled(Button)({
    textTransform: 'none',
    fontWeight: 600,
});

const MyEstates: React.FC = () => {
    const [estates, setEstates] = useState<Estate[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [editingEstateId, setEditingEstateId] = useState<string | null>(null);
    const [estateForm, setEstateForm] = useState<Partial<Estate>>({});
    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [selectedStatusId, setSelectedStatusId] = useState<string>('');
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('');

    useEffect(() => {
        fetchEstates();
        fetchTypes();
        fetchStatuses();
        fetchCurrencies();
    }, []);

    const fetchEstates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<Estate[]>('http://localhost:5224/api/Estate/myEstate', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEstates(response.data);
        } catch (error) {
            console.error("Error fetching estates:", error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await axios.get<Type[]>('http://localhost:5224/api/EstateType/list');
            setTypes(response.data);
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get<Status[]>('http://localhost:5224/api/EstateStatus/list');
            setStatuses(response.data);
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get<Currency[]>('http://localhost:5224/api/EstateCurrency/list');
            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    };

    const startEditing = (estate: Estate) => {
        setEditingEstateId(estate.id);
        setEstateForm({ ...estate, typeId: estate.type.id, statusId: estate.status.id, currencyId: estate.currency.id });
        setSelectedTypeId(estate.type.id);
        setSelectedStatusId(estate.status.id);
        setSelectedCurrencyId(estate.currency.id);
    };

    const updateEstate = async () => {
        try {
            if (estateForm.id) {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5224/api/Estate/${estateForm.id}`, {
                    ...estateForm,
                    typeId: selectedTypeId,  // type yerine typeId kullanalım
                    statusId: selectedStatusId,  // status yerine statusId kullanalım
                    currencyId: selectedCurrencyId  // currency yerine currencyId kullanalım
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEditingEstateId(null);
                setEstateForm({});
                setSelectedTypeId('');
                setSelectedStatusId('');
                setSelectedCurrencyId('');
                fetchEstates(); // Güncel listeyi almak için yeniden verileri çekiyoruz.
            }
        } catch (error) {
            console.error("Error updating estate:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5224/api/Estate/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEstates(estates.filter((estate) => estate.id !== id));
        } catch (error) {
            console.error("Error deleting estate:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEstateForm((prev) => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSelectChange = (name: 'type' | 'status' | 'currency', value: string) => {
        if (name === 'type') {
            setSelectedTypeId(value);
            setEstateForm(prev => ({ ...prev, typeId: value }));  // typeId olarak form state'ine ekleyelim
        } else if (name === 'status') {
            setSelectedStatusId(value);
            setEstateForm(prev => ({ ...prev, statusId: value }));  // statusId olarak form state'ine ekleyelim
        } else if (name === 'currency') {
            setSelectedCurrencyId(value);
            setEstateForm(prev => ({ ...prev, currencyId: value }));  // currencyId olarak form state'ine ekleyelim
        }
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Mülklerim
            </Typography>
            <Grid container spacing={3}>
                {estates.map((estate) => (
                    <Grid item xs={12} sm={6} md={4} key={estate.id}>
                        <StyledCard>
                            <StyledCardContent>
                                <Typography variant="h5" gutterBottom>
                                    {estate.type.name}
                                </Typography>
                                <Typography color="textSecondary" variant="body2" gutterBottom>
                                    {estate.status.name} - {estate.currency.name} {estate.price}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {new Date(estate.startDate).toLocaleDateString()} - {new Date(estate.endDate).toLocaleDateString()}
                                </Typography>

                                {/* Status güncelleme */}
                                {editingEstateId === estate.id && (
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            name="status"
                                            value={selectedStatusId}
                                            onChange={(e) => handleSelectChange('status', e.target.value)}
                                        >
                                            {statuses.map((status) => (
                                                <MenuItem key={status.id} value={status.id}>
                                                    {status.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                {/* Type güncelleme */}
                                {editingEstateId === estate.id && (
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            label="Type"
                                            name="type"
                                            value={selectedTypeId}
                                            onChange={(e) => handleSelectChange('type', e.target.value)}
                                        >
                                            {types.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                {/* Currency güncelleme */}
                                {editingEstateId === estate.id && (
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel>Currency</InputLabel>
                                        <Select
                                            label="Currency"
                                            name="currency"
                                            value={selectedCurrencyId}
                                            onChange={(e) => handleSelectChange('currency', e.target.value)}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency.id} value={currency.id}>
                                                    {currency.name} ({currency.symbol})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                {/* Price güncelleme */}
                                {editingEstateId === estate.id && (
                                    <TextField
                                        label="Price"
                                        name="price"
                                        value={estateForm.price || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                )}
                            </StyledCardContent>
                            <CardActions>
                                <Box display="flex" justifyContent="space-between" width="100%">
                                    {editingEstateId === estate.id ? (
                                        <StyledButton
                                            size="small"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={updateEstate}
                                        >
                                            {t("save")}
                                        </StyledButton>
                                    ) : (
                                        <StyledButton
                                            size="small"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => startEditing(estate)}
                                        >
                                            {t("update")}
                                        </StyledButton>
                                    )}
                                    <IconButton
                                        size="small"
                                        color="secondary"
                                        onClick={() => handleDelete(estate.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default MyEstates;

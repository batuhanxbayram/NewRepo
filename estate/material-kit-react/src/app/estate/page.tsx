"use client";
import React, { useState } from 'react';
import axios from 'axios';
import UploadPhotoForm from '../errors/not-found/page'; // Doğru yolu kontrol edin

function AddEstateForm() {
    const [estateName, setEstateName] = useState<string>('');
    const [photos, setPhotos] = useState<string[]>([]); // Tür belirtildi

    const handleAddEstate = async () => {
        const estateData = {
            name: estateName,
            photos: photos
        };

        try {
            await axios.post("http://localhost:5000/api/Estate", estateData);
            alert("Emlak başarıyla eklendi!");
        } catch (error) {
            console.error("Emlak ekleme başarısız", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={estateName}
                onChange={(e) => setEstateName(e.target.value)}
                placeholder="Emlak Adı"
            />
            <UploadPhotoForm setPhotos={setPhotos} /> {/* Fotoğraf yükleme formu burada */}
            <button onClick={handleAddEstate}>Emlak Ekle</button>
        </div>
    );
}

export default AddEstateForm;

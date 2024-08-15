"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

export default function Mapview() {
  const [estates, setEstates] = useState([]);

  function getPhotoId(photoPath) {
    const segments = photoPath.split('\\');
    const fileName = segments[segments.length - 1];
    return fileName;
  }

  useEffect(() => {
    axios.get('http://localhost:5224/api/Estate/list')
      .then(response => {
        console.log(response.data); // Response'u konsola basıyoruz
        setEstates(response.data);
      })
      .catch(error => console.error('Estate verileri çekilirken hata oluştu!', error));
  }, []);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38] // icon boyutu
  });

  return (
    <MapContainer center={[39.517, 32.640]} zoom={7} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution="Google Maps"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      <MarkerClusterGroup chunkedLoading>
        {estates.map((estate) => {
          
          const estateImage = estate.photos && estate.photos.length > 0
            ? `http://localhost:5224/estate_photos/${getPhotoId(estate.photos[0])}`
            : 'https://via.placeholder.com/345x194';

          return (
            <Marker
              key={estate.id}
              position={[estate.geoX, estate.geoY]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {estate.type ? estate.type : "Mülk"}
                </div>
                <div style={{ margin: '8px 0' }}>
                  <img
                    src={estateImage}
                    alt="Estate Thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ color: '#555', marginBottom: '8px' }}>
                  <div>Price: {estate.price}</div>
                  <div>Start Date: {new Date(estate.startDate).toLocaleDateString()}</div>
                  <div>End Date: {new Date(estate.endDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <a
                    href={`/detail/${estate.id}`} // Mülkün detay sayfasına yönlendirme
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Detayları Görüntüle
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

"use client";
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface UploadPhotoFormProps {
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const UploadPhotoForm: React.FC<UploadPhotoFormProps> = ({ setPhotos }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles) {
      const formData = new FormData();


      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("photo", selectedFiles[i]);
      }

      try {
        const response = await axios.post("http://localhost:5224/api/Estate/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response);


        console.log('Upload response:', response.data);
        console.log(response.data['dbPath']);
        const uploadedUrl = response.data['dbPath']; // Yüklenen dosyanın URL'sini alıyoruz
        console.log("Yüklenen URL'ler:", uploadedUrls);

        const updatedUrls = [...uploadedUrls, uploadedUrl];
        console.log("Yüklenen 1 URL'ler:", uploadedUrls);
        setUploadedUrls([response.data['dbPath']],);
        setPhotos([response.data['dbPath']]);
        console.log("Yüklenen 2 URL'ler:", uploadedUrls);

        // setUploadedUrls(prev => [...prev, uploadedUrl]); // Bu URL'yi state'e ekliyoruz
        // setPhotos(prev => [...prev, uploadedUrl]); // Ve aynı şekilde formData.photos'a ekliyoruz
        console.log("Yüklenen URL 3'ler:", uploadedUrls);

      } catch (error) {
        console.error("Fotoğraf yükleme başarısız", error);
      }
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="button" onClick={handleUpload}>Fotoğrafları Yükle</button> {/* type="button" kullanarak submit engelleniyor */}
      <div>
        Yüklenen Fotoğraflar:
        {uploadedUrls.map(url => (
          <img key={url} src={`http://localhost:5224/${url}`} alt="estate" width="100" />
        ))}
      </div>
    </div>
  );
};

export default UploadPhotoForm;

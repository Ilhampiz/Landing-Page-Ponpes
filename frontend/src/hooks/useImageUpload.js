import { useState } from 'react';
import api from '../api/axios';

export function useImageUpload() {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file) => {
        if (!file) return null;
        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await api.post('/admin/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data?.path || null;
        } catch (err) {
            console.error('Upload error:', err);
            alert('Gagal mengunggah foto. Pastikan format gambar sesuai.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
}

'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface UploadedImage {
  id?: string;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

interface Props {
  productId?: string;         // Si existe, sube directo al endpoint del producto
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({ productId, images, onChange, maxImages = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files || uploading) return;
    const remaining = maxImages - images.length;
    const toUpload  = Array.from(files).slice(0, remaining);
    if (!toUpload.length) return;

    setUploading(true);
    try {
      const results = await Promise.all(
        toUpload.map(async (file) => {
          const form = new FormData();
          form.append('file', file);

          let data: any;
          if (productId) {
            const res = await api.post(`/products/${productId}/images`, form);
            data = res.data;
            return { id: data.id, url: data.url, publicId: data.publicId, isPrimary: data.isPrimary };
          } else {
            const res = await api.post('/storage/upload', form);
            data = res.data;
            return { url: data.url, publicId: data.publicId };
          }
        }),
      );
      onChange([...images, ...results]);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (index: number) => {
    const img = images[index];
    if (productId && img.id) {
      try { await api.delete(`/products/${productId}/images/${img.id}`); } catch {}
    }
    onChange(images.filter((_, i) => i !== index));
  };

  const setPrimary = async (index: number) => {
    const img = images[index];
    if (productId && img.id) {
      try { await api.patch(`/products/${productId}/images/${img.id}/primary`); } catch {}
    }
    onChange(images.map((im, i) => ({ ...im, isPrimary: i === index })));
  };

  return (
    <div>
      {/* Zona de drop */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-3 text-center p-4 mb-3 transition-all`}
          style={{
            borderColor: dragOver ? '#059669' : '#e2e8f0',
            background: dragOver ? '#ecfdf5' : '#f8fafc',
            cursor: 'pointer',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
        >
          {uploading ? (
            <div>
              <div className="spinner-border spinner-border-sm me-2" style={{ color: '#059669' }} />
              <span style={{ color: '#059669', fontWeight: 600, fontSize: '0.88rem' }}>Subiendo...</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📸</div>
              <p style={{ color: '#334155', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                Arrastrá imágenes o hacé click
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                JPG, PNG, WebP — máx. 5 MB — ({images.length}/{maxImages})
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => upload(e.target.files)}
      />

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem' }}>
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1' }}
              >
                <img
                  src={img.url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Badge principal */}
                {img.isPrimary && (
                  <span style={{
                    position: 'absolute', top: 4, left: 4,
                    background: '#059669', color: 'white',
                    fontSize: '0.6rem', fontWeight: 800,
                    padding: '1px 5px', borderRadius: 4,
                  }}>
                    PRINCIPAL
                  </span>
                )}
                {/* Acciones */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(15,23,42,0.75)',
                  display: 'flex', justifyContent: 'space-around', padding: '4px',
                }}>
                  {!img.isPrimary && (
                    <button
                      title="Marcar como principal"
                      onClick={() => setPrimary(i)}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.9rem', padding: '2px' }}
                    >⭐</button>
                  )}
                  <button
                    title="Eliminar"
                    onClick={() => remove(i)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', padding: '2px' }}
                  >🗑</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export interface MediaItem {
  id?: string;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
  resourceType: 'image' | 'video';
}

interface Props {
  productId?: string;
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  maxItems?: number;
}

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export function MediaUploader({ productId, items, onChange, maxItems = 8 }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]  = useState(0);
  const [dragOver, setDragOver]  = useState(false);

  const uploadFiles = async (files: FileList | null) => {
    if (!files || uploading) return;
    const toUpload = Array.from(files).slice(0, maxItems - items.length);
    if (!toUpload.length) return;

    setUploading(true);
    setProgress(0);

    try {
      const results: MediaItem[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i];
        if (file.size > MAX_BYTES) { alert(`${file.name} supera el límite de 50 MB`); continue; }

        const form = new FormData();
        form.append('file', file);

        const endpoint = productId
          ? `/products/${productId}/images`
          : '/storage/upload';

        const { data } = await api.post(endpoint, form, {
          onUploadProgress: (e) =>
            setProgress(Math.round(((i + (e.progress || 0)) / toUpload.length) * 100)),
        });

        const isVideo = file.type.startsWith('video/');
        results.push({
          id:           data.id,
          url:          data.url,
          publicId:     data.publicId,
          isPrimary:    data.isPrimary ?? false,
          resourceType: isVideo ? 'video' : 'image',
        });
      }
      onChange([...items, ...results]);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (index: number) => {
    const item = items[index];
    if (productId && item.id) {
      try { await api.delete(`/products/${productId}/images/${item.id}`); } catch {}
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const setPrimary = async (index: number) => {
    const item = items[index];
    if (item.resourceType === 'video') return;
    if (productId && item.id) {
      try { await api.patch(`/products/${productId}/images/${item.id}/primary`); } catch {}
    }
    onChange(items.map((m, i) => ({ ...m, isPrimary: i === index })));
  };

  const canAdd = items.length < maxItems && !uploading;

  return (
    <div>
      {/* Drop zone */}
      {canAdd && (
        <motion.div
          whileHover={{ borderColor: '#059669', background: '#f0fdf4' }}
          style={{
            border: `2px dashed ${dragOver ? '#059669' : '#e2e8f0'}`,
            borderRadius: 12,
            background: dragOver ? '#f0fdf4' : '#f8fafc',
            padding: '1.75rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s',
            marginBottom: '1rem',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        >
          {uploading ? (
            <div>
              <div style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>⏫</div>
              <p style={{ color: '#059669', fontWeight: 700, margin: '0 0 0.4rem' }}>
                Subiendo... {progress}%
              </p>
              <div style={{ background: '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                <motion.div
                  style={{ background: '#059669', height: '100%', borderRadius: 999 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                {dragOver ? '📂' : '📸'}
              </div>
              <p style={{ fontWeight: 700, color: '#334155', margin: '0 0 0.2rem', fontSize: '0.92rem' }}>
                Arrastrá fotos o videos, o hacé click
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.76rem', margin: 0 }}>
                Fotos: JPG, PNG, WebP (máx. 5 MB) · Videos: MP4, WebM (máx. 50 MB)
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.74rem', margin: '0.3rem 0 0' }}>
                {items.length}/{maxItems} archivos
              </p>
            </>
          )}
        </motion.div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => uploadFiles(e.target.files)}
      />

      {/* Grilla de medios */}
      {items.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '0.65rem',
        }}>
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                style={{
                  position: 'relative',
                  borderRadius: 10,
                  overflow: 'hidden',
                  aspectRatio: '1',
                  border: item.isPrimary ? '2px solid #059669' : '2px solid #e2e8f0',
                  background: '#f1f5f9',
                }}
              >
                {item.resourceType === 'video' ? (
                  <video
                    src={item.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    playsInline
                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Badges */}
                <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', gap: 3 }}>
                  {item.resourceType === 'video' && (
                    <span style={{
                      background: 'rgba(0,0,0,0.65)', color: 'white',
                      fontSize: '0.6rem', fontWeight: 700, padding: '2px 5px',
                      borderRadius: 4,
                    }}>VIDEO</span>
                  )}
                  {item.isPrimary && (
                    <span style={{
                      background: '#059669', color: 'white',
                      fontSize: '0.6rem', fontWeight: 700, padding: '2px 5px',
                      borderRadius: 4,
                    }}>PRINCIPAL</span>
                  )}
                </div>

                {/* Acciones */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(15,23,42,0.78)',
                  display: 'flex', justifyContent: 'center',
                  gap: 4, padding: '5px',
                }}>
                  {item.resourceType === 'image' && !item.isPrimary && (
                    <button
                      title="Marcar como principal"
                      onClick={() => setPrimary(i)}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '1rem', padding: '2px 4px' }}
                    >⭐</button>
                  )}
                  <button
                    title="Eliminar"
                    onClick={() => remove(i)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1rem', padding: '2px 4px' }}
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

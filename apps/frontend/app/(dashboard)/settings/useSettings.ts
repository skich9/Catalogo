'use client';

import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export interface TenantSettings {
  name: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  logoUrl: string;
  logoPublicId: string;
  whatsappNumber: string;
  whatsappMessage: string;
  facebookPageUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  cartMode: 'WHATSAPP' | 'QR_PAYMENT';
  paymentInstructions: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface FontOption {
  id: string;
  label: string;
  family: string;
  url: string | null;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'default',    label: 'Por defecto',      family: 'system-ui, sans-serif',         url: null },
  { id: 'inter',      label: 'Inter',            family: "'Inter', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap' },
  { id: 'poppins',    label: 'Poppins',          family: "'Poppins', sans-serif",          url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap' },
  { id: 'montserrat', label: 'Montserrat',       family: "'Montserrat', sans-serif",       url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap' },
  { id: 'nunito',     label: 'Nunito',           family: "'Nunito', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap' },
  { id: 'playfair',   label: 'Playfair Display', family: "'Playfair Display', serif",      url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap' },
  { id: 'roboto',     label: 'Roboto',           family: "'Roboto', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
  { id: 'lato',       label: 'Lato',             family: "'Lato', sans-serif",             url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap' },
];

const DEFAULTS: TenantSettings = {
  name: '', description: '', phone: '', address: '', website: '',
  logoUrl: '', logoPublicId: '',
  whatsappNumber: '', whatsappMessage: '', facebookPageUrl: '',
  instagramUrl: '', tiktokUrl: '',
  cartMode: 'WHATSAPP', paymentInstructions: '',
  primaryColor: '#059669', secondaryColor: '#0f172a', fontFamily: 'default',
};

export type SettingsSection = 'info' | 'contact' | 'appearance' | 'payment';

export function useSettings() {
  const [form, setForm]       = useState<TenantSettings>(DEFAULTS);
  const [original, setOriginal] = useState<TenantSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('info');
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Inyectar fuentes de Google Fonts en el head para la preview
  useEffect(() => {
    FONT_OPTIONS.forEach((f) => {
      if (!f.url) return;
      if (document.querySelector(`link[href="${f.url}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = f.url;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    api.get('/tenants/me')
      .then(({ data }) => {
        const vals: TenantSettings = {
          name:                data.name               || '',
          description:         data.description        || '',
          phone:               data.phone              || '',
          address:             data.address            || '',
          website:             data.website            || '',
          logoUrl:             data.logoUrl            || '',
          logoPublicId:        data.logoPublicId       || '',
          whatsappNumber:      data.whatsappNumber     || '',
          whatsappMessage:     data.whatsappMessage    || '',
          facebookPageUrl:     data.facebookPageUrl    || '',
          instagramUrl:        data.instagramUrl       || '',
          tiktokUrl:           data.tiktokUrl          || '',
          cartMode:            data.cartMode           || 'WHATSAPP',
          paymentInstructions: data.paymentInstructions || '',
          primaryColor:        data.primaryColor       || '#059669',
          secondaryColor:      data.secondaryColor     || '#0f172a',
          fontFamily:          data.fontFamily         || 'default',
        };
        setForm(vals);
        setOriginal(vals);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setField = (field: keyof TenantSettings, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/tenants/me', form);
      setOriginal({ ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setForm({ ...original });

  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/storage/upload', formData);
      setForm((prev) => ({ ...prev, logoUrl: data.url, logoPublicId: data.publicId || '' }));
    } catch {
      alert('Error subiendo el logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const removeLogo = () => setForm((prev) => ({ ...prev, logoUrl: '', logoPublicId: '' }));

  const currentFont = FONT_OPTIONS.find((f) => f.id === form.fontFamily) || FONT_OPTIONS[0];

  return {
    form, setField, loading, saving, saved,
    isDirty, handleSave, handleDiscard,
    activeSection, setActiveSection,
    logoUploading, logoInputRef, handleLogoUpload, removeLogo,
    currentFont,
  };
}

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface TenantSettings {
  name: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  whatsappNumber: string;
  whatsappMessage: string;
  facebookPageUrl: string;
  cartMode: 'WHATSAPP' | 'QR_PAYMENT';
  paymentInstructions: string;
  primaryColor: string;
  secondaryColor: string;
}

const DEFAULTS: TenantSettings = {
  name: '', description: '', phone: '', address: '', website: '',
  whatsappNumber: '', whatsappMessage: '', facebookPageUrl: '',
  cartMode: 'WHATSAPP', paymentInstructions: '',
  primaryColor: '#059669', secondaryColor: '#0f172a',
};

export type SettingsSection = 'info' | 'contact' | 'appearance' | 'payment';

export function useSettings() {
  const [form, setForm] = useState<TenantSettings>(DEFAULTS);
  const [original, setOriginal] = useState<TenantSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('info');

  useEffect(() => {
    api.get('/tenants/me')
      .then(({ data }) => {
        const vals: TenantSettings = {
          name:               data.name            || '',
          description:        data.description     || '',
          phone:              data.phone            || '',
          address:            data.address          || '',
          website:            data.website          || '',
          whatsappNumber:     data.whatsappNumber   || '',
          whatsappMessage:    data.whatsappMessage  || '',
          facebookPageUrl:    data.facebookPageUrl  || '',
          cartMode:           data.cartMode         || 'WHATSAPP',
          paymentInstructions: data.paymentInstructions || '',
          primaryColor:       data.primaryColor     || '#059669',
          secondaryColor:     data.secondaryColor   || '#0f172a',
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

  return {
    form, setField, loading, saving, saved,
    isDirty, handleSave, handleDiscard,
    activeSection, setActiveSection,
  };
}

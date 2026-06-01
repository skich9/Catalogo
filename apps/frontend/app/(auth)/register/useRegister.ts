'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useRegister() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setFormState] = useState({
    businessName: '',
    businessSlug: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleBusinessName = (val: string) => {
    const slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormState((prev) => ({ ...prev, businessName: val, businessSlug: slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return { form, error, loading, setField, handleBusinessName, handleSubmit };
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthHook { 
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    router.push('/dashboard');
    return { success: true };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    router.push('/dashboard'); // Or a verification page
    return { success: true };
  };

  const signOut = async () => {
    setLoading(true);
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    router.push('/');
    return { success: true };
  };

  return { user, session, loading, signIn, signUp, signOut };
}
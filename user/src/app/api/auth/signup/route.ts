import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseRouteHandlerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = getSupabaseRouteHandlerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'User registered successfully. Check your email for verification.' });
}
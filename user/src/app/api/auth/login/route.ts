import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseRouteHandlerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = getSupabaseRouteHandlerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Logged in successfully.' });
}
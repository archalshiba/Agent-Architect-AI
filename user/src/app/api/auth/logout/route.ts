import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseRouteHandlerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = getSupabaseRouteHandlerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Logged out successfully.' });
}
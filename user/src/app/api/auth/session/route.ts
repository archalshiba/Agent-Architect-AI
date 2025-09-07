import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseRouteHandlerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = getSupabaseRouteHandlerClient();

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session });
}
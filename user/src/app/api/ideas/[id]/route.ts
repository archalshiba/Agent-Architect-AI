import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { data: appIdea, error } = await supabase
    .from('app_ideas')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return NextResponse.json({ error: 'App idea not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(appIdea);
}

export async function PUT(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const updates = await request.json();

  const { data, error } = await supabase
    .from('app_ideas')
    .update(updates)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return NextResponse.json({ error: 'App idea not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { error } = await supabase
    .from('app_ideas')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return NextResponse.json({ error: 'App idea not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

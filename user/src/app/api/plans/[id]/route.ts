import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Params {
  params: {
    id: string;
  };
}

async function authorizeBuildPlanAccess(supabase: any, buildPlanId: string, userId: string) {
  const { data: buildPlan, error } = await supabase
    .from('build_plans')
    .select(
      `
      id,
      app_ideas(user_id)
    `)
    .eq('id', buildPlanId)
    .single();

  if (error || !buildPlan) {
    return { authorized: false, error: 'Build plan not found' };
  }

  if (buildPlan.app_ideas.user_id !== userId) {
    return { authorized: false, error: 'Unauthorized access to build plan' };
  }

  return { authorized: true, buildPlan };
}

export async function GET(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { authorized, error: authError } = await authorizeBuildPlanAccess(supabase, id, session.user.id);

  if (!authorized) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { data: buildPlan, error } = await supabase
    .from('build_plans')
    .select('*, current_revision:PlanRevision(*)') // Fetch current revision content
    .eq('id', id)
    .single();

  if (error || !buildPlan) {
    return NextResponse.json({ error: 'Build plan not found' }, { status: 404 });
  }

  return NextResponse.json(buildPlan);
}

export async function PUT(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { authorized, error: authError } = await authorizeBuildPlanAccess(supabase, id, session.user.id);

  if (!authorized) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const updates = await request.json();

  const { data: updatedBuildPlan, error } = await supabase
    .from('build_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !updatedBuildPlan) {
    return NextResponse.json({ error: error?.message || 'Failed to update build plan' }, { status: 500 });
  }

  return NextResponse.json(updatedBuildPlan);
}

export async function DELETE(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { authorized, error: authError } = await authorizeBuildPlanAccess(supabase, id, session.user.id);

  if (!authorized) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { error } = await supabase
    .from('build_plans')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
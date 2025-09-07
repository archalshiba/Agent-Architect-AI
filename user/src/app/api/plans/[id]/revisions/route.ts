import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Params {
  params: {
    id: string; // build_plan_id
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

export async function POST(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const buildPlanId = params.id;
  const { authorized, error: authError } = await authorizeBuildPlanAccess(supabase, buildPlanId, session.user.id);

  if (!authorized) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { plan_content, generated_by_ai, editor_user_id } = await request.json();

  if (!plan_content) {
    return NextResponse.json({ error: 'Plan content is required' }, { status: 400 });
  }

  // Determine the next revision number
  const { data: latestRevision, error: latestRevisionError } = await supabase
    .from('plan_revisions')
    .select('revision_number')
    .eq('build_plan_id', buildPlanId)
    .order('revision_number', { ascending: false })
    .limit(1)
    .single();

  const nextRevisionNumber = (latestRevision?.revision_number || 0) + 1;

  // Insert new PlanRevision
  const { data: newRevision, error: insertRevisionError } = await supabase
    .from('plan_revisions')
    .insert({
      build_plan_id: buildPlanId,
      revision_number: nextRevisionNumber,
      plan_content,
      generated_by_ai: generated_by_ai || false,
      editor_user_id: editor_user_id || session.user.id, // Default to current user if not specified
    })
    .select()
    .single();

  if (insertRevisionError || !newRevision) {
    return NextResponse.json({ error: insertRevisionError?.message || 'Failed to create plan revision' }, { status: 500 });
  }

  // Update parent BuildPlan with current_revision_id
  const { error: updatePlanError } = await supabase
    .from('build_plans')
    .update({ current_revision_id: newRevision.id, updated_at: new Date().toISOString() })
    .eq('id', buildPlanId);

  if (updatePlanError) {
    return NextResponse.json({ error: updatePlanError.message || 'Failed to update build plan current revision' }, { status: 500 });
  }

  return NextResponse.json(newRevision, { status: 201 });
}

export async function GET(request: Request, { params }: Params) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const buildPlanId = params.id;
  const { authorized, error: authError } = await authorizeBuildPlanAccess(supabase, buildPlanId, session.user.id);

  if (!authorized) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  const { data: revisions, error } = await supabase
    .from('plan_revisions')
    .select('*')
    .eq('build_plan_id', buildPlanId)
    .order('revision_number', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(revisions);
}
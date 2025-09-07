import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { app_idea_id, plan_name } = await request.json();

  if (!app_idea_id || !plan_name) {
    return NextResponse.json({ error: 'App idea ID and plan name are required' }, { status: 400 });
  }

  // Verify that the AppIdea belongs to the authenticated user
  const { data: appIdea, error: appIdeaError } = await supabase
    .from('app_ideas')
    .select('id')
    .eq('id', app_idea_id)
    .eq('user_id', session.user.id)
    .single();

  if (appIdeaError || !appIdea) {
    return NextResponse.json({ error: 'App idea not found or unauthorized' }, { status: 403 });
  }

  const { data: buildPlan, error } = await supabase
    .from('build_plans')
    .insert({
      app_idea_id,
      plan_name,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(buildPlan, { status: 201 });
}

export async function GET(request: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: buildPlans, error } = await supabase
    .from('build_plans')
    .select(`
      *,
      app_ideas(user_id)
    `)
    .filter('app_ideas.user_id', 'eq', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter out the app_ideas object from the response for cleaner data
  const filteredBuildPlans = buildPlans.map(plan => {
    const { app_ideas, ...rest } = plan;
    return rest;
  });

  return NextResponse.json(filteredBuildPlans);
}
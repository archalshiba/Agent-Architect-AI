import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { buildPlanId } = await req.json();

  if (!buildPlanId) {
    return NextResponse.json({ error: 'Build plan ID is required' }, { status: 400 });
  }

  // Fetch the BuildPlan and its latest PlanRevision
  const { data: buildPlan, error: buildPlanError } = await supabase
    .from('build_plans')
    .select(
      `
      id,
      plan_name,
      current_revision:PlanRevision(*)
    `)
    .eq('id', buildPlanId)
    .single();

  if (buildPlanError || !buildPlan) {
    return NextResponse.json({ error: 'Build plan not found' }, { status: 404 });
  }

  if (!buildPlan.current_revision || !buildPlan.current_revision.plan_content) {
    return NextResponse.json({ error: 'Build plan content not found' }, { status: 404 });
  }

  // Placeholder for no-code blueprint generation logic
  // In a real scenario, you'd import and use a generator utility here
  const generatedBlueprint = JSON.stringify(buildPlan.current_revision.plan_content, null, 2);

  return new NextResponse(generatedBlueprint, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="no-code-blueprint-${buildPlanId}.json"`,
    },
  });
}

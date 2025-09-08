import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BuildPlan } from '@/types';

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
  const { data: buildPlanData, error: buildPlanError } = await supabase
    .from('build_plans')
    .select(
      `
      id,
      plan_name,
      current_revision:PlanRevision(*)
    `)
    .eq('id', buildPlanId)
    .single();

  const buildPlan = buildPlanData as BuildPlan;

  if (buildPlanError || !buildPlan) {
    return NextResponse.json({ error: 'Build plan not found' }, { status: 404 });
  }

  if (!buildPlan.current_revision || !buildPlan.current_revision.plan_content) {
    return NextResponse.json({ error: 'Build plan content not found' }, { status: 404 });
  }

  // Placeholder for agent task formatting logic
  // In a real scenario, you'd import and use a formatter utility here
  const formattedContent = JSON.stringify(buildPlan.current_revision.plan_content, null, 2);

  return new NextResponse(formattedContent, {
    headers: {
      'Content-Type': 'application/jsonl',
      'Content-Disposition': `attachment; filename="agent-tasks-${buildPlanId}.jsonl"`,
    },
  });
}

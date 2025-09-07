import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateBuildPlan } from '@/lib/ai/planGenerator';

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { app_idea_id } = await req.json();

  if (!app_idea_id) {
    return NextResponse.json({ error: 'App idea ID is required' }, { status: 400 });
  }

  // Fetch AppIdea details
  const { data: appIdea, error: appIdeaError } = await supabase
    .from('app_ideas')
    .select('*')
    .eq('id', app_idea_id)
    .eq('user_id', session.user.id)
    .single();

  if (appIdeaError || !appIdea) {
    return NextResponse.json({ error: 'App idea not found or unauthorized' }, { status: 404 });
  }

  try {
    const planContent = await generateBuildPlan(appIdea);

    // Check if a BuildPlan already exists for this app_idea_id
    const { data: existingBuildPlan, error: fetchPlanError } = await supabase
      .from('build_plans')
      .select('id')
      .eq('app_idea_id', app_idea_id)
      .single();

    let buildPlanId;

    if (existingBuildPlan) {
      buildPlanId = existingBuildPlan.id;
      // Optionally update existing build plan metadata if needed
      await supabase
        .from('build_plans')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', buildPlanId);
    } else {
      // Insert new BuildPlan
      const { data: newBuildPlan, error: insertPlanError } = await supabase
        .from('build_plans')
        .insert({
          app_idea_id,
          plan_name: planContent.plan_name || 'Generated Build Plan',
          status: 'generated',
        })
        .select('id')
        .single();

      if (insertPlanError || !newBuildPlan) {
        throw new Error(`Failed to create build plan: ${insertPlanError?.message}`);
      }
      buildPlanId = newBuildPlan.id;
    }

    // Insert new PlanRevision
    const { data: newRevision, error: insertRevisionError } = await supabase
      .from('plan_revisions')
      .insert({
        build_plan_id: buildPlanId,
        revision_number: 1, // Assuming first revision for now, will need logic for subsequent revisions
        plan_content: planContent,
        generated_by_ai: true,
        editor_user_id: session.user.id, // Or null if AI generated without direct user edit
      })
      .select('id')
      .single();

    if (insertRevisionError || !newRevision) {
      throw new Error(`Failed to create plan revision: ${insertRevisionError?.message}`);
    }

    // Update BuildPlan with current_revision_id
    await supabase
      .from('build_plans')
      .update({ current_revision_id: newRevision.id, status: 'generated' })
      .eq('id', buildPlanId);

    return NextResponse.json({ message: 'Build plan generated and saved successfully', buildPlanId });
  } catch (error: any) {
    console.error('Error generating or saving build plan:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
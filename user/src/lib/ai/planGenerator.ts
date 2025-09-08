import openai from '../../lib/openai';
import { buildPrompt } from './promptBuilder';
import { AppIdea } from '../../types';

export async function generateBuildPlan(appIdea: AppIdea): Promise<any> {
  const prompt = buildPrompt(appIdea);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Or 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const planContentString = completion.choices[0].message.content;

    if (!planContentString) {
      throw new Error('OpenAI did not return any content.');
    }

    try {
      const planContent = JSON.parse(planContentString);
      return planContent;
    } catch (jsonError) {
      console.error('Failed to parse JSON from OpenAI response:', planContentString);
      throw new Error('Invalid JSON response from AI.');
    }
  } catch (apiError: any) {
    console.error('OpenAI API call failed:', apiError.message);
    throw new Error(`AI plan generation failed: ${apiError.message}`);
  }
}
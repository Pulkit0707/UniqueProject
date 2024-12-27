import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function getProjectUniqueScore(title: string, description: string): Promise<number> {
  const prompt = `Analyze this project idea and rate its uniqueness on a scale of 0-100, where 100 is completely unique and innovative:

Project Title: ${title}
Project Description: ${description}

Consider the following factors:
1. Innovation: How novel is the core concept?
2. Market Gap: Does it solve a unique problem?
3. Implementation Approach: Is the proposed solution different from existing ones?
4. Target Audience: Does it serve an underserved market?
5. Technical Feasibility: Is it realistically achievable?

Please provide a numerical score (0-100) based on these factors.`;

  try {
    const response = await hf.textGeneration({
      model: 'microsoft/phi-2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.3,
      },
    });

    // Extract the numerical score from the response
    const match = response.generated_text.match(/\d+/);
    if (match) {
      const score = parseInt(match[0], 10);
      return Math.min(100, Math.max(0, score)); // Ensure score is between 0-100
    }
    return 50; // Default score if parsing fails
  } catch (error) {
    console.error('AI scoring error:', error);
    throw new Error('Failed to get AI score');
  }
}
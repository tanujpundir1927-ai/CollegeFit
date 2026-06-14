import { colleges } from "../data/colleges";

const SYSTEM_PROMPT = `
You are CollegeFit AI, an elite AI admission advisor for engineering students in India.
Your goal is to guide students on choosing the best college, explaining recommendations, comparing IITs, NITs, IIITs, and private colleges, and offering strategic career advice.

You have access to the official college dataset (10 colleges):
${JSON.stringify(colleges, null, 2)}

Instructions:
1. ONLY recommend or reference colleges from this dataset or offer general guidance about engineering admissions in India (IITs, NITs, IIITs, BITS, etc.).
2. When answering about specific cutoffs, ranks, placements, or fees, use the exact values from the dataset.
3. Be professional, structured, encouraging, and clear. Use bullet points and bold styling for readability.
4. If a student asks "IIT vs NIT comparison", compare their placements, cutoffs, and culture using the dataset values.
5. If they ask about percentile eligibility, guide them based on their score. (e.g. 95 percentile fits NITs, IIITs, BITS, etc. while IITs require 99+ percentile).
6. Keep answers concise, direct, and highly informative. Do not reference raw JSON structure in your output.
`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Calls Gemini streamGenerateContent REST endpoint.
 * Returns the raw Fetch Response so Next.js route can stream it directly to client.
 */
export async function getGeminiChatStream(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }

  // Map roles to Gemini format ("user" | "model")
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  return response;
}

/**
 * Generates a targeted match insight for a single college recommendation.
 */
export async function getRecommendationInsight(
  collegeName: string,
  userPercentile: number,
  priority: string,
  reasons: string[]
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `Highly matches your ${priority}-focused goals and academic percentile.`;
  }

  const prompt = `
College Name: ${collegeName}
Student Percentile: ${userPercentile}%
Priority: ${priority}
Reasons: ${reasons.join(", ")}

Generate a single, punchy, professional AI insight sentence (max 30 words) explaining why this college fits the student's profile.
Example: "Based on your percentile and placement-focused goals, IIIT Hyderabad is a strong match due to its exceptional CSE placements and robust tech environment."
Do NOT put quotes around the response. Return only the raw sentence.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 100 },
        }),
      }
    );

    if (!response.ok) return `Fits your profile based on cutoff and your priority: ${priority}.`;

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || `Fits your profile based on cutoff and your priority: ${priority}.`;
  } catch (err) {
    console.error("Error generating insight:", err);
    return `Fits your profile based on cutoff and your priority: ${priority}.`;
  }
}

/**
 * Generates an analytical comparison summary for a list of colleges.
 */
export async function getComparisonSummary(collegesToCompare: typeof colleges) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }

  const prompt = `
You are asked to compare these colleges:
${JSON.stringify(collegesToCompare, null, 2)}

Provide a structured Markdown summary covering:
1. **Best Overall Option**: Choose one and explain why in 2 sentences.
2. **Best Placement Option**: Choose one based on avg package and explain in 2 sentences.
3. **Best ROI Option**: Choose one considering placement package vs fees per year and explain in 2 sentences.
4. **Key Strengths**: Bullet points highlighting core advantages of each compared college.
5. **Trade-offs / Weaknesses**: Bullet points highlighting what to consider or sacrifice (e.g. BITS has high fees, IITs have higher cutoffs).

Formatting instructions:
Keep the tone professional and helpful. Use exact figures.
Return the output directly as clean Markdown.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1200,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  return response;
}

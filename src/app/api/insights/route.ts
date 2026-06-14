import { NextRequest } from "next/server";
import { getRecommendationInsight } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { collegeId, collegeName, percentile, priority, reasons } = await req.json();

    if (!collegeId || !collegeName) {
      return new Response("Missing required parameters: 'collegeId' and 'collegeName'.", { status: 400 });
    }

    const insight = await getRecommendationInsight(
      collegeName,
      percentile || 95.0,
      priority || "balanced",
      reasons || []
    );

    return Response.json({ insight });
  } catch (error: unknown) {
    console.error("Insights API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export const dynamic = "force-dynamic";

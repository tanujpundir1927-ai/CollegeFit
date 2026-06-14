import { NextRequest } from "next/server";
import { getGeminiChatStream } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request body. 'messages' array is required.", { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const geminiResponse = await getGeminiChatStream(messages);

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (!cleanedLine.startsWith("data: ")) continue;

              const dataStr = cleanedLine.slice(6);
              if (dataStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(dataStr);
                const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textChunk) {
                  controller.enqueue(new TextEncoder().encode(textChunk));
                }
              } catch {
                // Ignore incomplete lines
              }
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export const dynamic = "force-dynamic";

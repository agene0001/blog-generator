import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const SYSTEM_PROMPT = `You are an expert blog writer.
Write a complete, well-structured blog post in GitHub-flavored Markdown based on the user's topic.
Rules:
- Begin with a single "# " level-one title.
- Use "## " for main sections and "### " for subsections.
- Write engaging, informative prose in full paragraphs.
- Do NOT wrap the entire response in a code fence.
- Do NOT include YAML front matter or commentary outside the post.`;

export async function POST(req: Request) {
    let prompt: string;
    let userKey: string | undefined;

    try {
        const body = await req.json();
        prompt = (body?.prompt ?? "").toString().trim();
        userKey = typeof body?.apiKey === "string" && body.apiKey ? body.apiKey : undefined;
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!prompt) {
        return Response.json({ error: "A prompt is required." }, { status: 400 });
    }

    // BYOK: prefer the user-supplied key, fall back to the server's env key.
    const apiKey = userKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: "No OpenAI API key. Add your own key in settings or set OPENAI_API_KEY on the server." },
            { status: 400 },
        );
    }

    const client = new OpenAI({ apiKey });

    let stream;
    try {
        stream = await client.chat.completions.create({
            model: DEFAULT_MODEL,
            stream: true,
            temperature: 0.8,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
        });
    } catch (err: unknown) {
        const status = (err as { status?: number })?.status ?? 500;
        const message =
            (err as { message?: string })?.message ?? "Failed to reach the OpenAI API.";
        return Response.json({ error: message }, { status });
    }

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                for await (const part of stream) {
                    const delta = part.choices[0]?.delta?.content ?? "";
                    if (delta) controller.enqueue(encoder.encode(delta));
                }
            } catch (err) {
                controller.error(err);
                return;
            }
            controller.close();
        },
    });

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}

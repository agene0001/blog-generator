import { createFalClient } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 300;

const MODEL = process.env.FAL_VIDEO_MODEL || "fal-ai/ltx-video";

type FalVideoOutput = {
    video?: { url?: string };
    videos?: Array<{ url?: string }>;
};

function falErrorMessage(err: unknown): string {
    const e = err as { message?: string; body?: unknown };
    if (e?.message) return e.message;
    const body = e?.body as { detail?: unknown; message?: string } | string | undefined;
    if (body) {
        if (typeof body === "string") return body;
        if (typeof body.detail === "string") return body.detail;
        if (Array.isArray(body.detail)) {
            return body.detail
                .map((d) => (d as { msg?: string })?.msg ?? JSON.stringify(d))
                .join("; ");
        }
        if (typeof body.message === "string") return body.message;
        return JSON.stringify(body);
    }
    return "Failed to reach fal.ai.";
}

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

    const credentials = userKey || process.env.FAL_KEY;
    if (!credentials) {
        return Response.json(
            { error: "No fal.ai API key. Add your own key in settings or set FAL_KEY on the server." },
            { status: 400 },
        );
    }

    const fal = createFalClient({ credentials });

    try {
        const result = await fal.subscribe(MODEL, { input: { prompt } });
        const data = result.data as FalVideoOutput;
        const url = data?.video?.url ?? data?.videos?.[0]?.url;
        if (!url) {
            return Response.json({ error: "No video was returned." }, { status: 502 });
        }
        return Response.json({ url });
    } catch (err: unknown) {
        const status = (err as { status?: number })?.status ?? 500;
        return Response.json({ error: falErrorMessage(err) }, { status });
    }
}

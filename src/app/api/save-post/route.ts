import { createClient } from "@/app/lib/supabase/server";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

function extFromContentType(ct: string | null): string {
    if (!ct) return "jpg";
    if (ct.includes("png")) return "png";
    if (ct.includes("webp")) return "webp";
    return "jpg";
}

export async function POST(req: Request) {
    if (!isSupabaseConfigured) {
        return Response.json({ error: "Supabase is not configured on the server." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ error: "You must be signed in to save." }, { status: 401 });
    }

    let title: string | undefined;
    let prompt: string | undefined;
    let content: string;
    let imageUrl: string | undefined;

    try {
        const body = await req.json();
        content = (body?.content ?? "").toString();
        title = body?.title ? String(body.title) : undefined;
        prompt = body?.prompt ? String(body.prompt) : undefined;
        imageUrl = body?.imageUrl ? String(body.imageUrl) : undefined;
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!content.trim()) {
        return Response.json({ error: "Nothing to save yet." }, { status: 400 });
    }

    // Persist the (ephemeral) generated image into Supabase Storage for a durable URL.
    let storedImageUrl = imageUrl ?? null;
    if (imageUrl) {
        try {
            const resp = await fetch(imageUrl);
            if (resp.ok) {
                const bytes = new Uint8Array(await resp.arrayBuffer());
                const ext = extFromContentType(resp.headers.get("content-type"));
                const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
                const { error: upErr } = await supabase.storage
                    .from(BUCKET)
                    .upload(path, bytes, {
                        contentType: resp.headers.get("content-type") ?? "image/jpeg",
                        upsert: false,
                    });
                if (!upErr) {
                    storedImageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
                }
            }
        } catch {
            // Fall back to the original URL if storage upload fails.
        }
    }

    const { data, error } = await supabase
        .from("posts")
        .insert({ user_id: user.id, title, prompt, content, image_url: storedImageUrl })
        .select()
        .single();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ post: data });
}

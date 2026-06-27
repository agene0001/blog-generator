import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { marked } from "marked";
import { createClient } from "@/app/lib/supabase/server";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function PostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    if (!isSupabaseConfigured) redirect("/login");

    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: post } = await supabase
        .from("posts")
        .select("title, content, image_url, created_at")
        .eq("id", id)
        .single();

    if (!post) notFound();

    const html = marked.parse(post.content, { async: false }) as string;

    return (
        <main className="example">
            <div className="example__inner">
                <Link href="/posts" className="link-button">← My posts</Link>
                <article className="example-blog">
                    {post.image_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img className="generator-image" src={post.image_url} alt="Blog header" />
                    )}
                    <div className="example-blog__text" dangerouslySetInnerHTML={{ __html: html }} />
                </article>
            </div>
        </main>
    );
}

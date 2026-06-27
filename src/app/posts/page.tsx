import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export const dynamic = "force-dynamic";

type PostRow = {
    id: string;
    title: string | null;
    prompt: string | null;
    created_at: string;
};

export default async function PostsPage() {
    if (!isSupabaseConfigured) {
        return (
            <main className="auth">
                <div className="auth__card">
                    <h1 className="auth__title">My posts</h1>
                    <p className="generator-error">⚠ Supabase isn’t configured.</p>
                    <Link href="/blogGenerator" className="link-button">← Back to generator</Link>
                </div>
            </main>
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, prompt, created_at")
        .order("created_at", { ascending: false });

    const rows = (posts ?? []) as PostRow[];

    return (
        <main className="example">
            <div className="example__inner">
                <div className="posts__header">
                    <h2 className="example-heading">My posts</h2>
                    <div className="posts__header-actions">
                        <Link href="/blogGenerator" className="btn-secondary">New post</Link>
                        <form action="/auth/signout" method="post">
                            <button type="submit" className="link-button">Sign out</button>
                        </form>
                    </div>
                </div>
                <p className="generator-intro">Signed in as {user.email}</p>

                {rows.length === 0 ? (
                    <p className="generator-status">No saved posts yet. Generate one and hit Save.</p>
                ) : (
                    <ul className="posts__list">
                        {rows.map((p) => (
                            <li key={p.id}>
                                <Link href={`/posts/${p.id}`} className="posts__item">
                                    <span className="posts__item-title">
                                        {p.title || p.prompt || "Untitled post"}
                                    </span>
                                    <span className="posts__item-date">
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}

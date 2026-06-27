'use client'
import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {marked} from 'marked';
import {downloadHtml, downloadMarkdown, titleSlug} from '@/app/lib/download';
import {createClient} from '@/app/lib/supabase/client';
import {isSupabaseConfigured} from '@/app/lib/supabase/config';

const OPENAI_KEY_STORAGE = 'byok_openai_key';
const FAL_KEY_STORAGE = 'byok_fal_key';

type Status = 'idle' | 'loading' | 'done' | 'error';

/** Topic to seed generation from: the post's H1 if present, else the prompt. */
function deriveTopic(output: string, prompt: string): string {
    const match = output.match(/^#\s+(.+)$/m);
    return (match ? match[1] : prompt).trim();
}

export default function BlogGenerator() {
    const [prompt, setPrompt] = useState('');
    const [openaiKey, setOpenaiKey] = useState('');
    const [falKey, setFalKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const [output, setOutput] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');
    const abortRef = useRef<AbortController | null>(null);

    const [imageUrl, setImageUrl] = useState('');
    const [imageStatus, setImageStatus] = useState<Status>('idle');
    const [imageError, setImageError] = useState('');

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        const o = localStorage.getItem(OPENAI_KEY_STORAGE);
        if (o) setOpenaiKey(o);
        const f = localStorage.getItem(FAL_KEY_STORAGE);
        if (f) setFalKey(f);
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        const supabase = createClient();
        supabase.auth.getUser().then(({data}) => setUserEmail(data.user?.email ?? null));
        const {data: sub} = supabase.auth.onAuthStateChange((_e, session) =>
            setUserEmail(session?.user?.email ?? null),
        );
        return () => sub.subscription.unsubscribe();
    }, []);

    function persist(storageKey: string, setter: (v: string) => void) {
        return (v: string) => {
            setter(v);
            if (v) localStorage.setItem(storageKey, v);
            else localStorage.removeItem(storageKey);
        };
    }

    const saveOpenaiKey = persist(OPENAI_KEY_STORAGE, setOpenaiKey);
    const saveFalKey = persist(FAL_KEY_STORAGE, setFalKey);

    async function generate() {
        if (!prompt.trim() || status === 'loading') return;
        setOutput('');
        setError('');
        setStatus('loading');
        setSaveStatus('idle');

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt, apiKey: openaiKey || undefined}),
                signal: controller.signal,
            });

            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => ({error: res.statusText}));
                throw new Error(data.error || 'Generation failed.');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            for (;;) {
                const {done, value} = await reader.read();
                if (done) break;
                setOutput((prev) => prev + decoder.decode(value, {stream: true}));
            }
            setStatus('done');
        } catch (e) {
            if ((e as Error).name === 'AbortError') {
                setStatus(output ? 'done' : 'idle');
                return;
            }
            setError((e as Error).message || 'Something went wrong.');
            setStatus('error');
        } finally {
            abortRef.current = null;
        }
    }

    function stop() {
        abortRef.current?.abort();
    }

    async function generateImage() {
        const topic = deriveTopic(output, prompt);
        if (!topic || imageStatus === 'loading') return;
        setImageStatus('loading');
        setImageError('');

        try {
            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    prompt: `${topic}, editorial blog header illustration, high detail, vibrant, no text`,
                    apiKey: falKey || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Image generation failed.');
            setImageUrl(data.url);
            setImageStatus('done');
        } catch (e) {
            setImageError((e as Error).message || 'Something went wrong.');
            setImageStatus('error');
        }
    }

    async function savePost() {
        if (!output || saveStatus === 'saving') return;
        setSaveStatus('saving');
        setSaveError('');
        try {
            const res = await fetch('/api/save-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: deriveTopic(output, prompt),
                    prompt,
                    content: output,
                    imageUrl: imageUrl || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Save failed.');
            setSaveStatus('saved');
        } catch (e) {
            setSaveError((e as Error).message || 'Save failed.');
            setSaveStatus('error');
        }
    }

    const html = output ? (marked.parse(output, {async: false}) as string) : '';
    const isLoading = status === 'loading';
    const imageLoading = imageStatus === 'loading';
    const name = titleSlug(output, prompt || 'blog-post');
    const canGenerateImage = Boolean(deriveTopic(output, prompt));
    // Embed the (ephemeral) image at the top of exports when present.
    const exportMarkdown = imageUrl ? `![Header image](${imageUrl})\n\n${output}` : output;

    return (
        <section className="example">
            <div className="example__inner">
                {isSupabaseConfigured && (
                    <div className="generator-auth">
                        {userEmail ? (
                            <>
                                <Link href="/posts" className="link-button">My posts</Link>
                                <span className="generator-hint">{userEmail}</span>
                                <form action="/auth/signout" method="post">
                                    <button type="submit" className="link-button">Sign out</button>
                                </form>
                            </>
                        ) : (
                            <Link href="/login" className="link-button">Sign in</Link>
                        )}
                    </div>
                )}
                <h2 className="example-heading">Blog Generator</h2>
                <p className="generator-intro">
                    Describe the blog post you want and our AI will write a complete,
                    formatted article — add a header image, then download or publish it.
                </p>

                <div className="generator-key">
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => setShowSettings((s) => !s)}
                    >
                        {showSettings ? '▾' : '▸'} API keys
                    </button>
                    {showSettings && (
                        <div className="generator-key__panel">
                            <div className="generator-key__row">
                                <label htmlFor="byok-openai">OpenAI</label>
                                <input
                                    id="byok-openai"
                                    type="password"
                                    placeholder="sk-… (else server default)"
                                    value={openaiKey}
                                    onChange={(e) => saveOpenaiKey(e.target.value.trim())}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="generator-key__row">
                                <label htmlFor="byok-fal">fal.ai</label>
                                <input
                                    id="byok-fal"
                                    type="password"
                                    placeholder="fal key (optional — enables images)"
                                    value={falKey}
                                    onChange={(e) => saveFalKey(e.target.value.trim())}
                                    autoComplete="off"
                                />
                            </div>
                            <span className="generator-hint">
                                Keys are stored only in this browser. Without a fal.ai key, posts are text-only.
                            </span>
                        </div>
                    )}
                </div>

                <textarea
                    className="generator-input"
                    placeholder="e.g. Top 5 Tourist Attractions in New York"
                    value={prompt}
                    rows={3}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
                    }}
                />

                <div className="generator-actions">
                    {isLoading ? (
                        <button type="button" className="btn-primary" onClick={stop}>Stop</button>
                    ) : (
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={generate}
                            disabled={!prompt.trim()}
                        >
                            Generate
                        </button>
                    )}
                    {falKey && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={generateImage}
                            disabled={!canGenerateImage || imageLoading}
                        >
                            {imageLoading ? 'Creating image…' : imageUrl ? 'Regenerate image' : 'Generate image'}
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => downloadMarkdown(exportMarkdown, name)}
                        disabled={!output || isLoading}
                    >
                        Download .md
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => downloadHtml(exportMarkdown, name)}
                        disabled={!output || isLoading}
                    >
                        Download .html
                    </button>
                    {isSupabaseConfigured &&
                        (userEmail ? (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={savePost}
                                disabled={!output || isLoading || saveStatus === 'saving'}
                            >
                                {saveStatus === 'saving'
                                    ? 'Saving…'
                                    : saveStatus === 'saved'
                                        ? 'Saved ✓'
                                        : 'Save'}
                            </button>
                        ) : output ? (
                            <Link href="/login" className="btn-secondary">Sign in to save</Link>
                        ) : null)}
                    {isLoading && <span className="generator-status">Generating…</span>}
                </div>

                {error && <p className="generator-error">⚠ {error}</p>}
                {imageError && <p className="generator-error">⚠ Image: {imageError}</p>}
                {saveError && <p className="generator-error">⚠ Save: {saveError}</p>}

                {(output || isLoading || imageUrl) && (
                    <article className="example-blog">
                        {imageUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img className="generator-image" src={imageUrl} alt="Blog header"/>
                        )}
                        {html && (
                            <div className="example-blog__text" dangerouslySetInnerHTML={{__html: html}}/>
                        )}
                    </article>
                )}
            </div>
        </section>
    );
}

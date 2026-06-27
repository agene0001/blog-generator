'use client'
import React, {useEffect, useState} from 'react';
import {downloadFromUrl, slugify} from '@/app/lib/download';

const FAL_KEY_STORAGE = 'byok_fal_key';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function VideoGenerator() {
    const [prompt, setPrompt] = useState('');
    const [falKey, setFalKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        const f = localStorage.getItem(FAL_KEY_STORAGE);
        if (f) setFalKey(f);
    }, []);

    function saveFalKey(v: string) {
        setFalKey(v);
        if (v) localStorage.setItem(FAL_KEY_STORAGE, v);
        else localStorage.removeItem(FAL_KEY_STORAGE);
    }

    async function generate() {
        if (!prompt.trim() || !falKey || status === 'loading') return;
        setVideoUrl('');
        setError('');
        setStatus('loading');
        try {
            const res = await fetch('/api/generate-video', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt, apiKey: falKey}),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Video generation failed.');
            setVideoUrl(data.url);
            setStatus('done');
        } catch (e) {
            setError((e as Error).message || 'Something went wrong.');
            setStatus('error');
        }
    }

    const isLoading = status === 'loading';

    return (
        <section className="example">
            <div className="example__inner">
                <h2 className="example-heading">Video Generator</h2>
                <p className="generator-intro">
                    Describe a scene and our AI will generate a short video clip you can preview
                    and download. Video generation runs on fal.ai, so it needs a fal.ai API key.
                </p>

                <div className="generator-key">
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => setShowSettings((s) => !s)}
                    >
                        {showSettings ? '▾' : '▸'} API key {falKey ? '(set)' : '(required)'}
                    </button>
                    {showSettings && (
                        <div className="generator-key__panel">
                            <div className="generator-key__row">
                                <label htmlFor="byok-fal-video">fal.ai</label>
                                <input
                                    id="byok-fal-video"
                                    type="password"
                                    placeholder="fal key"
                                    value={falKey}
                                    onChange={(e) => saveFalKey(e.target.value.trim())}
                                    autoComplete="off"
                                />
                            </div>
                            <span className="generator-hint">Stored only in this browser.</span>
                        </div>
                    )}
                </div>

                <textarea
                    className="generator-input"
                    placeholder="e.g. A drone shot flying over a misty mountain range at sunrise"
                    value={prompt}
                    rows={3}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
                    }}
                />

                <div className="generator-actions">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={generate}
                        disabled={!prompt.trim() || !falKey || isLoading}
                    >
                        {isLoading ? 'Generating…' : 'Generate video'}
                    </button>
                    {videoUrl && !isLoading && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => downloadFromUrl(videoUrl, `${slugify(prompt, 'video')}.mp4`)}
                        >
                            Download .mp4
                        </button>
                    )}
                    {!falKey && (
                        <span className="generator-status">Add a fal.ai key in settings to generate.</span>
                    )}
                    {isLoading && (
                        <span className="generator-status">This can take a minute or two…</span>
                    )}
                </div>

                {error && <p className="generator-error">⚠ {error}</p>}

                {videoUrl && (
                    <div className="example-blog">
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video className="generator-video" src={videoUrl} controls autoPlay loop/>
                    </div>
                )}
            </div>
        </section>
    );
}

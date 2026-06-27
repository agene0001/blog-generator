'use client'
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {createClient} from '@/app/lib/supabase/client';
import {isSupabaseConfigured} from '@/app/lib/supabase/config';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        setMessage('');

        const supabase = createClient();
        try {
            if (mode === 'signup') {
                const {error} = await supabase.auth.signUp({
                    email,
                    password,
                    options: {emailRedirectTo: `${location.origin}/auth/callback`},
                });
                if (error) throw error;
                setMessage('Check your email to confirm your account, then sign in.');
                setMode('signin');
            } else {
                const {error} = await supabase.auth.signInWithPassword({email, password});
                if (error) throw error;
                router.push('/posts');
                router.refresh();
            }
        } catch (err) {
            setError((err as Error).message || 'Authentication failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="auth">
            <div className="auth__card">
                <h1 className="auth__title">{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>

                {!isSupabaseConfigured && (
                    <p className="generator-error">
                        ⚠ Supabase isn’t configured. Add NEXT_PUBLIC_SUPABASE_URL and
                        NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.
                    </p>
                )}

                <form className="auth__form" onSubmit={submit}>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        required
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        required
                        minLength={6}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" disabled={busy || !isSupabaseConfigured}>
                        {busy ? '…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
                    </button>
                </form>

                {message && <p className="generator-status">{message}</p>}
                {error && <p className="generator-error">⚠ {error}</p>}

                <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                        setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
                        setError('');
                        setMessage('');
                    }}
                >
                    {mode === 'signin'
                        ? 'Need an account? Sign up'
                        : 'Already have an account? Sign in'}
                </button>

                <Link href="/blogGenerator" className="link-button">← Back to generator</Link>
            </div>
        </main>
    );
}

'use client'
import React, {createContext, useCallback, useContext, useEffect, useRef} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {motion, useAnimationControls} from 'framer-motion';

type TransitionContextValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionContextValue>({navigate: () => {}});
export const usePageTransition = () => useContext(TransitionContext);

const EASE = [0.7, 0, 0.3, 1] as const;
const DURATION = 0.5;

/**
 * Persistent page-transition overlay. Lives in the root layout so it survives
 * route changes: it wipes a cover IN, navigates underneath it, then wipes OUT
 * to reveal the new page — so the animation plays *during* navigation.
 */
export default function PageTransition({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const controls = useAnimationControls();
    const pendingRef = useRef<string | null>(null);
    const fallbackRef = useRef<number | null>(null);

    const reveal = useCallback(async () => {
        pendingRef.current = null;
        // Wipe off to the right to reveal the freshly-mounted page.
        controls.set({transformOrigin: 'right center'});
        await controls.start({scaleX: 0, transition: {duration: DURATION, ease: EASE}});
    }, [controls]);

    const navigate = useCallback(
        async (href: string) => {
            if (pendingRef.current) return;
            pendingRef.current = href;

            // Wipe the cover in from the left until it fills the screen.
            controls.set({transformOrigin: 'left center', scaleX: 0});
            await controls.start({scaleX: 1, transition: {duration: DURATION, ease: EASE}});

            router.push(href);

            // Safety net: if the route doesn't actually change, reveal anyway.
            if (fallbackRef.current) window.clearTimeout(fallbackRef.current);
            fallbackRef.current = window.setTimeout(() => {
                if (pendingRef.current) reveal();
            }, 1500);
        },
        [controls, router, reveal],
    );

    // Once the new route is active, reveal it.
    useEffect(() => {
        if (pendingRef.current && pathname === pendingRef.current) {
            if (fallbackRef.current) window.clearTimeout(fallbackRef.current);
            reveal();
        }
    }, [pathname, reveal]);

    return (
        <TransitionContext.Provider value={{navigate}}>
            {children}
            <motion.div
                className="page-transition"
                initial={{scaleX: 0}}
                animate={controls}
                aria-hidden="true"
            />
        </TransitionContext.Provider>
    );
}

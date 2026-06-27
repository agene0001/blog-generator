'use client'
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {marked} from 'marked';

interface TypewriterProps {
    text: string;
    /** When true, type out; when false, reset to empty. */
    start?: boolean;
    /** ms between ticks */
    speed?: number;
    /** characters revealed per tick (use >1 for long text) */
    charsPerTick?: number;
    onComplete?: () => void;
    className?: string;
    /** keep the caret blinking after typing finishes */
    keepCaretAfter?: boolean;
    /** render the revealed text as markdown (no inline caret in this mode) */
    markdown?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({
    text,
    start = true,
    speed = 50,
    charsPerTick = 1,
    onComplete,
    className,
    keepCaretAfter = false,
    markdown = false,
}) => {
    const [count, setCount] = useState(0);

    // Keep onComplete in a ref so an inline callback doesn't restart typing.
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (!start) {
            setCount(0);
            return;
        }

        let current = 0;
        setCount(0);
        const id = window.setInterval(() => {
            current = Math.min(current + charsPerTick, text.length);
            setCount(current);
            if (current >= text.length) {
                window.clearInterval(id);
                onCompleteRef.current?.();
            }
        }, speed);

        return () => window.clearInterval(id);
    }, [start, text, speed, charsPerTick]);

    const done = count >= text.length;
    const revealed = text.slice(0, count);

    const html = useMemo(
        () => (markdown ? (marked.parse(revealed, {async: false}) as string) : ''),
        [markdown, revealed],
    );

    if (markdown) {
        return <div className={className} dangerouslySetInnerHTML={{__html: html}}/>;
    }

    const showCaret = start && (!done || keepCaretAfter);

    return (
        <span className={className}>
            {revealed}
            {showCaret && <span className="tw-caret" aria-hidden="true"/>}
        </span>
    );
};

export default Typewriter;

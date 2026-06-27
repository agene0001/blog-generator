'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion, useAnimation, useInView} from 'framer-motion';
import Typewriter from '@/app/components/Typewriter';

const PROMPT = 'A serene 3D animated forest meadow at sunrise with rolling green hills';

// Demo clip shown in place of a live (slow, paid) generation. Served locally from
// /public (Big Buck Bunny, CC-BY, Blender Foundation). Swap for your own clip or a
// video your generator produced.
const DEMO_VIDEO_SRC = '/demo-video.mp4';

export default function VideoExampleSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, {amount: 0.3});
    const submitControls = useAnimation();
    const [videoStarted, setVideoStarted] = useState(false);
    const timer = useRef<number | null>(null);

    // Reset/replay as the section enters and leaves the viewport.
    useEffect(() => {
        submitControls.start({opacity: inView ? 1 : 0, transition: {duration: 0.4}});
        if (!inView) {
            setVideoStarted(false);
            if (timer.current) {
                window.clearTimeout(timer.current);
                timer.current = null;
            }
        }
    }, [inView, submitControls]);

    const handlePromptComplete = useCallback(() => {
        submitControls.start({scale: [1, 0.85, 1], transition: {duration: 0.45, ease: 'easeInOut'}});
        timer.current = window.setTimeout(() => setVideoStarted(true), 650);
    }, [submitControls]);

    return (
        <section className="example" ref={sectionRef}>
            <div className="example__inner">
                <h2 className="example-heading">Example</h2>

                <div className="prompt-row">
                    <div className="prompt-box">
                        <span className="prompt-chevron">&gt;</span>
                        <Typewriter
                            text={PROMPT}
                            start={inView}
                            speed={55}
                            keepCaretAfter
                            onComplete={handlePromptComplete}
                            className="prompt-text"
                        />
                    </div>
                    <motion.button
                        type="button"
                        className="example-submit"
                        initial={{opacity: 0}}
                        animate={submitControls}
                    >
                        Generate
                    </motion.button>
                </div>

                {videoStarted && (
                    <motion.div
                        className="example-blog"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                    >
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video
                            className="generator-video"
                            src={DEMO_VIDEO_SRC}
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

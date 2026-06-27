'use client'
import WaterDropGrid from "@/app/components/WaterDropGrid";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize(); // Set the initial width
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        // Cleanup event listener on component unmount
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []); // Empty dependency array ensures this runs only once after initial render

    useEffect(() => {
        console.log('Window width:', windowWidth);
    }, [windowWidth]); // Dependency array contains windowWidth to log changes

    return (
        <>
            <WaterDropGrid />
            <section
                className="hero"
                style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                <div
                    className="hero-block hero-block--header"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: "center",
                        // justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        padding: '0 1rem',
                    }}>
                    <motion.h1
                        className="hero-title m-4 md:ml-80"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    >
                        Transform Ideas into Impact
                    </motion.h1>
                    <motion.p
                        className="hero-text bg-black md:ml-80"
                        // x: "3rem" mirrors the resting translateX(3rem) from the .hero-text CSS rule,
                        // so framer-motion owns the full transform and nothing clobbers it.
                        initial={{ opacity: 0, x: "3rem", y: 30 }}
                        animate={{ opacity: 1, x: "3rem", y: 0 }}
                        transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
                    >
                        Create stunning blog posts, eye-catching images, and engaging videos—all in one place. Unleash your creativity and let AI bring your vision to life effortlessly.
                    </motion.p>
                </div>
            </section>
        </>
    );
}
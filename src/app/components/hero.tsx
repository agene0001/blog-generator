'use client'
import WaterDropGrid from "@/app/components/WaterDropGrid";
import React, { useEffect, useState } from "react";


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
            <section
                className="z-10 relative w-screen"
                style={{
                    height:'100vh',
                    width: '100',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                <WaterDropGrid />
                <div
                    style={{
                        display: 'flex',
                        textAlign: "center",
                        flexDirection: "column",
                        // justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <h1 className={`hero-title relative text-center text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 ease-out `}>
                        Transform Ideas into Impact
                    </h1>
                    <p className="hero-text bg-black md:ml-80 " style={{maxWidth: "55rem"}}>
                        Create stunning blog posts, eye-catching images, and engaging videos—all in one place. Unleash your creativity and let AI bring your vision to life effortlessly.
                    </p>
                </div>
            </section>
        </>
    );
}
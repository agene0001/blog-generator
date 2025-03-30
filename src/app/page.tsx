'use client'
import Navbar from "@/app/components/navbar";
// HeroSection component is commented out in the original code, keeping it commented
// import HeroSection from "@/app/components/hero";
import InteractiveSection from "@/app/components/InteractiveSection";
import React, {useState} from "react";
import HeroSection from "@/app/components/hero"; // Explicit React import is good practice

export default function Home() {

    return (<>
        <div className="absolute hidden nav-bar">
            <Navbar/>
        </div>
            {/* The main content div */}


            {/* Background image div */}
        {/*<div >*/}
            <HeroSection />
            <div
                // Existing className kept: heroback spacerImg w-full
                // Existing style property mapped to Tailwind:
                // minHeight: "400px" -> min-h-[400px] (Using arbitrary value syntax)
                className="heroback spacerImg w-full min-h-[400px]"
                // style attribute removed
            >
                {/* Content inside this div if needed */}
            </div>

            {/* Text content block */}
            <div
                // Existing className kept: hero-block hero-block--header
                // Existing style properties mapped to Tailwind:
                // textAlign: "center" -> text-center
                // maxWidth: "1500px" -> max-w-[1500px] (Using arbitrary value syntax)
                // Note: Tailwind has max-w-7xl (1280px) as the largest default. Using arbitrary value.
                className="hero-block hero-block--header text-center max-w-[1500px]"
                // style attribute removed
            >
                <h1
                    // Existing className kept: hero-title hero-title2
                    // Existing style properties mapped to Tailwind:
                    // fontSize: "2.5rem" -> text-[2.5rem] (Using arbitrary value syntax)
                    // lineHeight: "1.2" -> leading-[1.2] (Using arbitrary value syntax, requires unitless)
                    className="hero-title hero-title2 text-[2.5rem] leading-[1.2]"
                    // style attribute removed
                >
                    Blog Generator
                </h1>
                <p
                    // Existing className kept: hero-text3 mx-15 (Note: mx-15 is not a standard Tailwind class, keeping it as is)
                    // Existing style properties mapped to Tailwind:
                    // marginTop: "2rem" -> mt-8 (2rem = 8 * 0.25rem)
                    // fontSize: "1.2rem" -> text-[1.2rem] (Using arbitrary value syntax)
                    // lineHeight: "1.6" -> leading-[1.6] (Using arbitrary value syntax)
                    className="hero-text3 mx-15 mt-8 text-[1.2rem] leading-[1.6]"
                    // style attribute removed
                >
                    Try out our latest fully autonomous Blog post creator. Our AI-powered content creation platform
                    is designed to streamline and elevate your creative process. With advanced AI prompting,
                    effortlessly generate complete, high-quality blog posts tailored to your specified topics and
                    audience. Each blog is complemented by featured images that are not only visually striking but
                    also contextually relevant.
                </p>
            </div>

            {/* InteractiveSection component - Ensure it's responsive */}
            <InteractiveSection/>
        </>);
}
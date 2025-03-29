import Navbar from "@/app/components/navbar";
import HeroSection from "@/app/components/hero";
import InteractiveSection from "@/app/components/InteractiveSection";
import React from "react";

export default function Home() {
    return (
        <>
            <Navbar/>
            {/*<HeroSection />*/}
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 20px", // Add some padding for better spacing
            }}>

                <div className="heroback spacerImg w-full" style={{ minHeight: "400px" }}></div>

                <div className="hero-block hero-block--header" style={{ textAlign: "center", maxWidth: "1500px" }}>
                    <h1 className="hero-title hero-title2" style={{ fontSize: "2.5rem", lineHeight: "1.2" }}>
                        Blog Generator
                    </h1>
                    <p className="hero-text3 mx-15" style={{ marginTop: "2rem", fontSize: "1.2rem", lineHeight: "1.6" }}>
                        Try out our latest fully autonomous Blog post creator. Our AI-powered content creation platform
                        is designed to streamline and elevate your creative process. With advanced AI prompting,
                        effortlessly generate complete, high-quality blog posts tailored to your specified topics and
                        audience. Each blog is complemented by featured images that are not only visually striking but
                        also contextually relevant.
                    </p>
                </div>

                {/* Ensure InteractiveSection is responsive */}
                <InteractiveSection/>
            </div>
        </>
    );
}

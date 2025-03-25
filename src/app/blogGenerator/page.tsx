import Navbar from "@/app/components/navbar";
import HeroSection from "@/app/components/hero";
import InteractiveSection from "@/app/components/InteractiveSection";
import React from "react";

export default function blogGenerator() {
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
                alignItems: "center"
            }}>

                <div className='heroback  spacerImg w-screen'></div>
                <div className="hero-block hero-block--header " style={{textAlign: "center"}}>
                    <h1 className="hero-title hero-title2 m-4 md:ml-80">Blog Generator</h1>
                    <p className="hero-text3 mx-20 md:ml-64 " style={{marginTop: '6rem'}}>
                        Try out our latest fully autonomous Blog post creator. Our AI-powered content creation platform
                        is designed to streamline and elevate your creative process. With advanced AI prompting,
                        effortlessly generate complete, high-quality blog posts tailored to your specified topics and
                        audience. Each blog is complemented by featured images that are not only visually striking but
                        also contextually relevant.
                    </p>
                </div>
                <InteractiveSection/>
            </div>
        </>
    );
}
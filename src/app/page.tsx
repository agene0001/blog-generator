import Navbar from "@/app/components/navbar";
import InteractiveSection from "@/app/components/InteractiveSection";
import VideoExampleSection from "@/app/components/VideoExampleSection";
import TransitionLink from "@/app/components/TransitionLink";
import React from "react";

export default function Home() {
    return (
        <>
            <Navbar/>
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center"
            }}>

                <div className='heroback  spacerImg w-screen'></div>

                <div className="hero-block hero-block--header " style={{textAlign: "start"}}>
                    <h1 className="hero-title hero-title2 ">Blog Generator</h1>
                    <p className="hero-text3 mx-15 md:ml-64 " style={{marginTop: '6rem'}}>
                        Try out our latest fully autonomous Blog post creator. Our AI-powered content creation platform
                        is designed to streamline and elevate your creative process. With advanced AI prompting,
                        effortlessly generate complete, high-quality blog posts tailored to your specified topics and
                        audience. Each blog is complemented by featured images that are not only visually striking but
                        also contextually relevant.
                    </p>
                    <div className="home-cta">
                        <TransitionLink href="/blogGenerator" className="btn-primary">
                            Try the Blog Generator
                        </TransitionLink>
                    </div>
                </div>

                <InteractiveSection/>

                <div className="hero-block hero-block--header " style={{textAlign: "start"}}>
                    <h1 className="hero-title hero-title2 ">Video Generator</h1>
                    <p className="hero-text3 mx-15 md:ml-64 " style={{marginTop: '6rem'}}>
                        Bring your ideas to life in motion. Describe a scene and our AI video platform turns it into a
                        short, share-ready clip—complete with camera movement and atmosphere tailored to your prompt.
                        Generate, preview, and download polished video in a single step, no editing software required.
                    </p>
                    <div className="home-cta">
                        <TransitionLink href="/videoGenerator" className="btn-primary">
                            Try the Video Generator
                        </TransitionLink>
                    </div>
                </div>

                <VideoExampleSection/>
            </div>
        </>
    );
}

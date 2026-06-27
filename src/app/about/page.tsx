import Navbar from "@/app/components/navbar";
import TransitionLink from "@/app/components/TransitionLink";
import React from "react";

export default function AboutPage() {
    return (
        <>
            <Navbar/>
            <section className="example">
                <div className="example__inner">
                    <h2 className="example-heading">About</h2>
                    <p className="generator-intro">
                        This is an AI content studio that turns a single prompt into
                        ready-to-publish media. Write a topic and get a complete, formatted
                        blog post — with an optional header image — or describe a scene and
                        generate a short video clip. Everything streams in live as it’s created.
                    </p>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3 className="feature-card__title">Blog generation</h3>
                            <p className="feature-card__text">
                                Streamed, fully-formatted Markdown blog posts you can download as
                                .md or .html, or save to your account.
                            </p>
                            <TransitionLink href="/blogGenerator" className="btn-primary">Open Blog Generator</TransitionLink>
                        </div>

                        <div className="feature-card">
                            <h3 className="feature-card__title">Image generation</h3>
                            <p className="feature-card__text">
                                Add a striking, on-topic header image to any post and regenerate it
                                until it’s right — powered by fal.ai.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3 className="feature-card__title">Video generation</h3>
                            <p className="feature-card__text">
                                Turn a description into a short, share-ready video clip you can
                                preview and download.
                            </p>
                            <TransitionLink href="/videoGenerator" className="btn-primary">Open Video Generator</TransitionLink>
                        </div>

                        <div className="feature-card">
                            <h3 className="feature-card__title">Bring your own keys</h3>
                            <p className="feature-card__text">
                                Use your own OpenAI and fal.ai keys — stored only in your browser —
                                so generation runs on your account. Sign in to save your work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

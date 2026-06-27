'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion, useAnimation, useInView} from 'framer-motion';
import Typewriter from "@/app/components/Typewriter";

const PROMPT = 'Top 5 Tourist Attractions in New York?';

const BLOG = `# Top 5 Tourist Attractions in New York City

New York City, fondly referred to as the Big Apple, is a vibrant tapestry of culture, history, and innovation. It stands tall as one of the world's most visited cities, and for a good reason. The myriad of attractions scattered throughout the city speaks volumes about its rich heritage and diverse attractions. Whether you are a first-time visitor or a seasoned traveler, NYC offers a wealth of experiences that captivate the heart and soul. In this blog post, we will explore the top five tourist attractions you cannot miss when visiting New York City.

## 1. The Statue of Liberty and Ellis Island

### A Symbol of Freedom
The Statue of Liberty, a gift from France, was dedicated on October 28, 1886. It has since become a symbol of freedom and democracy worldwide. Located on Liberty Island, this colossal statue stands 305 feet tall, crowned by a golden flame. To truly appreciate the intricate details, visitors can ascend to the crown for a panoramic view of New York Harbor.

### A Journey Through Immigration
Adjacent to Liberty Island lies Ellis Island, the site of the United States' busiest immigrant processing station from 1892 to 1954. Over 12 million immigrants passed through its halls in search of a new life. Today, the Ellis Island National Museum of Immigration offers visitors an immersive experience with exhibits, photographs, and personal stories.

## 2. Central Park

### An Urban Oasis
Central Park, stretching over 843 acres, is a green jewel in the heart of Manhattan. Designed by Frederick Law Olmsted and Calvert Vaux in the 1850s, it was the first landscaped public park in the United States. This enchanting haven offers a myriad of attractions, including picturesque landscapes, scenic walking paths, and iconic landmarks.

### Activities Beyond Sightseeing
Within Central Park, visitors can enjoy a plethora of activities, from boating on the serene lakes to ice skating in Wollman Rink during the winter months. The park also features child-friendly areas like the Central Park Zoo and the Central Park Conservatory Garden, a gorgeous floral display in the springtime.

No matter where your travels take you, remember that the stories, memories, and experiences you gather in New York City will enrich your journey long after you leave.`;

const InteractiveSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, {amount: 0.3});
    const submitControls = useAnimation();

    const [blogStarted, setBlogStarted] = useState(false);
    const blogTimer = useRef<number | null>(null);

    // Reset the whole sequence whenever the section leaves the viewport so it
    // replays on the next entry.
    useEffect(() => {
        submitControls.start({opacity: inView ? 1 : 0, transition: {duration: 0.4}});
        if (!inView) {
            setBlogStarted(false);
            if (blogTimer.current) {
                window.clearTimeout(blogTimer.current);
                blogTimer.current = null;
            }
        }
    }, [inView, submitControls]);

    // When the prompt finishes typing: "press" submit, then reveal the blog.
    const handlePromptComplete = useCallback(() => {
        submitControls.start({
            scale: [1, 0.85, 1],
            transition: {duration: 0.45, ease: 'easeInOut'},
        });
        blogTimer.current = window.setTimeout(() => setBlogStarted(true), 650);
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
                        Submit
                    </motion.button>
                </div>

                <article className="example-blog">
                    <Typewriter
                        text={BLOG}
                        start={blogStarted}
                        speed={20}
                        charsPerTick={6}
                        markdown
                        className="example-blog__text"
                    />
                </article>
            </div>
        </section>
    );
};

export default InteractiveSection;

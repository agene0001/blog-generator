'use client'
import React, {useEffect, useRef, useState} from 'react';
import anime from 'animejs';
import AnimatedInput from "@/app/components/AnimatedInput";
import {animate, inView, motion, useAnimation} from 'framer-motion';

const InteractiveSection: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const blogAniBtn = useRef<HTMLInputElement>(null);
    const [submitIsVisible, setSubmitIsVisible] = useState(false);
    const controls = useAnimation();

    // Typing animation for the input field
    useEffect(() => {
        controls.start({
            opacity: [0, 1],
            transition: {duration: 0.5},
        });

        if (!inputRef.current) return;

        const chars = 'Top 5 Tourist Attractions in New York?'.split('');
        inputRef.current.value = ''; // Temporarily clear the input value

        const animation = anime.timeline({
            loop: false,
            easing: 'easeOutExpo',
        });

        chars.forEach((char, index) => {
            animation.add({
                targets: inputRef.current,
                value: inputRef.current?.value + char,
                delay: index * 100,
                duration: 100
            });
        });

        return () => animation.restart(); // Reset the animation if the component unmounts
    }, [controls]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setSubmitIsVisible(true);
                    } else {
                        setSubmitIsVisible(false);
                    }
                });
            },
            {threshold: 0.1}
        );

        if (blogAniBtn.current) {
            observer.observe(blogAniBtn.current);
        }

        return () => {
            if (blogAniBtn.current) {
                observer.unobserve(blogAniBtn.current);
            }
            observer.disconnect();
        };
    }, [blogAniBtn]);

    useEffect(() => {
        if (submitIsVisible) {
            controls.start({opacity: 1, transition: {duration: 0.5}});
            triggerAnimation();
        } else {
            controls.start({opacity: 0, transition: {duration: 0.5}});
        }
    }, [submitIsVisible, controls]);

    function triggerAnimation() {
        var textWrapper = document.querySelector('.ml6 .letters');
        if (textWrapper) {
            textWrapper.innerHTML = textWrapper.textContent?.replace(/\S/g, "<span class='letter'>$&</span>") as string;
            const animation = anime.timeline({loop: false}).add({
                targets: '.ml6 .letter',
                translateY: ["2em", 0],
                opacity: [0, 1],
                translateZ: 0,
                duration: 750,
                delay: (el: any, i: number) => 50 * i + 5100
            })
                .add({
                    targets: '.ml6',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    complete: function () {
                        animation.restart();
                        animation.pause()
                    },
                    delay: 1000,

                })

            if (submitIsVisible) {
                animation.play();

                // animation.restart()
                // animation.pause()
            } else {
                animation.restart()
                animation.pause()
            }


        }
    }

    // Animation for the text


    return (
        <>
            <div className="justify-items-center">
                <label className='hero-text2'>
                    Prompt
                </label>
            </div>
            <div className='flex justify-center'>
                <AnimatedInput style={{width: '20rem'}} value='Top 5 Tourist Attractions in New York?'
                               className={'rounded-md md:ml-72 lg:ml-20 animated-input'} submitRef={blogAniBtn}/>
                <motion.input
                    ref={blogAniBtn}
                    initial={{opacity: 0}}
                    animate={controls}
                    type='button'
                    className='bg-pink-500 w-20 btn rounded-md'
                    value='Submit'/>
            </div>
            <div className="flex justify-center">

            </div>
            <div className="flex justify-center">
                <p className="text-white sm:m-4 md:ml-80 p-4 blogPara rounded-md" style={{backgroundColor: "#16213B"}}>

                    <span className="ml6 letters text-amber-50"> Top 5 Tourist Attractions in New York City<br/></span>
                    <span className="text-wrapper md:ml-72 lg:m-0 jetbrains-mono-Uni">
              <span className="letters text-amber-50 ">
    New York City, fondly referred to as the Big Apple, is a vibrant tapestry of culture, history, and innovation.
    It stands tall as one of the world's most visited cities, and for a good reason.
    The myriad of attractions scattered throughout the city speaks volumes about its rich heritage and diverse attractions.
    Whether you are a first-time visitor or a seasoned traveler, NYC offers a wealth of experiences that captivate the heart and soul.
    In this blog post, we will explore the top five tourist attractions you cannot miss when visiting New York City.
</span>

## 1. The Statue of Liberty and Ellis Island

### A Symbol of Freedom
The Statue of Liberty, a gift from France, was dedicated on October 28, 1886.
It has since become a symbol of freedom and democracy worldwide.
Located on Liberty Island, this colossal statue stands 305 feet tall, crowned by a golden flame.
To truly appreciate the intricate details, visitors can ascend to the crown for a panoramic view of New York Harbor.

### A Journey Through Immigration
Adjacent to Liberty Island lies Ellis Island, the site of the United States' busiest immigrant processing station from 1892 to 1954.
Over 12 million immigrants passed through its halls in search of a new life.
Today, the Ellis Island National Museum of Immigration offers visitors an immersive experience with exhibits, photographs, and personal stories.
The touching stories highlighted in the museum offer a profound insight into the human spirit and the pursuit of the American Dream.

### Planning Your Visit
To visit both locations, reserve your tickets in advance through the Statue Cruises website.
The ferry ride provides stunning views of the NYC skyline and the harbor, making it an integral part of the experience.
Arriving early is recommended as lines can grow quickly, especially during peak tourist seasons.

## 2. Central Park

### An Urban Oasis
Central Park, stretching over 843 acres, is a green jewel in the heart of Manhattan.
Designed by Frederick Law Olmsted and Calvert Vaux in the 1850s, it was the first landscaped public park in the United States.
This enchanting haven offers a myriad of attractions, including picturesque landscapes, scenic walking paths, and iconic landmarks.

### Activities Beyond Sightseeing
Within Central Park, visitors can enjoy a plethora of activities, from boating on the serene lakes to ice skating in Wollman Rink during the winter months.
The park also features child-friendly areas like the Central Park Zoo and the Central Park Conservatory Garden, a gorgeous floral display in the springtime.

                        {/*### Discovering the Hidden Gems*/}
                        {/*While exploring the park, don't miss out on the Bethesda Terrace, with its stunning fountain, and the Bow Bridge, a romantic spot with breathtaking views.*/}
                        {/*For those looking for a unique experience, consider booking a horse-drawn carriage ride for a true taste of park nostalgia.*/}

                        {/*## 3. The Metropolitan Museum of Art*/}

                        {/*### A Cultural Institution*/}
                        {/*The Metropolitan Museum of Art, commonly known as the Met, is one of the largest and most prestigious art museums in the world.*/}
                        {/*Founded in 1870, it houses a collection of over two million works spanning 5,000 years of history.*/}
                        {/*From ancient artifacts to contemporary masterpieces, the Met offers a comprehensive journey through the evolution of art.*/}

                        {/*### Highlights of the Collection*/}
                        {/*The museum is divided into several departments, each featuring unique treasures.*/}
                        {/*The Egyptian Art collection, featuring mummies and monumental sculptures, transports visitors back in time.*/}
                        {/*The American Wing showcases paintings from iconic artists like John Singer Sargent and Winslow Homer, while the Costume Institute features an exquisite collection of fashion.*/}

                        {/*### Visiting Tips*/}
                        {/*The Met is vast, so consider planning your visit by highlighting specific exhibits you want to see.*/}
                        {/*Admission is donation-based, allowing flexibility for visitors.*/}
                        {/*Don't forget to take a break at the museum café, where you can enjoy views of Central Park while savoring delicious dishes.*/}

                        {/*## 4. Times Square*/}

                        {/*### The Crossroads of the World*/}
                        {/*Broadway's neon-lit Times Square is known as "The Crossroads of the World," pulsating with energy and excitement.*/}
                        {/*This bustling intersection serves as the heart of New York City's entertainment district, attracting millions annually.*/}
                        {/*The moment you step into Times Square, you'll be enveloped by the sights and sounds of a city that never sleeps.*/}

                        {/*### A Hub of Entertainment*/}
                        {/*Home to numerous theaters, Times Square is the gateway to Broadway.*/}
                        {/*Catching a show is a must, with productions ranging from timeless classics like "The Phantom of the Opera" to contemporary hits like "Hamilton."*/}
                        {/*Be sure to book tickets in advance, as popular shows often sell out quickly.*/}

                        {/*### Iconic Landmarks*/}
                        {/*While exploring Times Square, soak in the vibrant atmosphere while marveling at landmarks like the famous electronic billboards.*/}
                        {/*If you visit during the holiday season, the towering Christmas tree at Rockefeller Center and the festive decorations will leave you spellbound.*/}

                        {/*### Dining and Shopping*/}
                        {/*Take a break from the sights by indulging in world-class dining options nearby, catering to all tastes and budgets.*/}
                        {/*You’ll find everything from casual eateries to upscale dining experiences.*/}
                        {/*And don't forget to explore the many shops, from iconic brands to quirky boutiques, and find unique souvenirs to commemorate your NYC adventure.*/}

                        {/*## 5. The 9/11 Memorial and Museum*/}

                        {/*### Honoring Heroes*/}
                        {/*The 9/11 Memorial and Museum is a poignant tribute to those who lost their lives during the tragic events of September 11, 2001.*/}
                        {/*Reflecting pools, set within the footprints of the original Twin Towers, create a serene atmosphere where visitors can pay their respects.*/}
                        {/*Surrounding the pools are the names of all the victims, etched into bronze parapets, offering a somber yet beautiful remembrance.*/}

                        {/*### Learning through History*/}
                        {/*The museum itself provides a deeper understanding of the events of that fateful day and its aftermath through firsthand accounts, artifacts, and multimedia exhibits.*/}
                        {/*Visitors can explore the timelines of the events, the heroic rescue efforts, and the lasting impact of 9/11 on the global community.*/}

                        {/*### A Location for Reflection*/}
                        {/*Situated in Lower Manhattan, the memorial and museum invite visitors to reflect on the resilience of humanity and the importance of community in the face of adversity.*/}
                        {/*A visit to this site is an essential and humbling element of New York's rich history.*/}

                        {/*## Conclusion*/}
                        {/*New York City is a treasure trove of tourism experiences encompassing cultural landmarks, historical sites, and vibrant neighborhoods.*/}
                        {/*Each of the attractions highlighted in this post offers its unique insights into what makes this city a must-visit for travelers from all walks of life.*/}
                        {/*As you explore the Statue of Liberty, Central Park, the Metropolitan Museum of Art, Times Square, and the 9/11 Memorial, you’ll come to understand the heart of New York City— a place that resonates with artistic expression, historical significance, and an enduring spirit of resilience.*/}
                        No matter where your travels take you, remember that the stories, memories, and experiences you gather in New York City will enrich your journey long after you leave.</span>
                </p>
            </div>
        </>);
};

export default InteractiveSection;
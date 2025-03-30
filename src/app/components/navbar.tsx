'use client'
import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
// WaterDropGrid seems unlikely to be used *inside* the Navbar itself
// import WaterDropGrid from "@/app/components/WaterDropGrid";
import HeroSection from "@/app/components/hero";
import {NavItem, State} from "@/types/global"; // Navbar renders HeroSection within its <main>
// router was not used in the provided code
// import { router } from "next/client";

// --- Interfaces ---

// --- Component ---
const Navbar: React.FC = () => {
    // --- State and Refs ---
    const [state, setState] = useState<State>({ navigationItems: {}, root: null, activeItem: undefined });
    const itemsRef = useRef<HTMLUListElement>(null); // Ref for the main nav list
    const rootRef = useRef<HTMLDivElement>(null); // Ref for the root layout element

    const colors = ['hsla(14, 97%, 65%, 0.4)']; // Example color for frontdrop

    // --- Effects ---

    // Effect 1: Initial setup - Find nav items and set up state
    useEffect(() => {
        // Ensure refs are current before proceeding
        if (!itemsRef.current || !rootRef.current) return;

        const items = itemsRef.current.querySelectorAll('.nav--header-1 > .nav__item');
        const navItemsMap: Record<number, NavItem> = {};

        items.forEach((item, navItemIndex) => {
            const navLink = item.querySelector('a.nav__link') as HTMLAnchorElement;

            const handleItemClick = (event: MouseEvent) => {
                event.preventDefault(); // Prevent default browser navigation
                // Update the active item state, triggering the next effect
                setState((prevState) => ({
                    ...prevState,
                    activeItem: navItemIndex // Set the ID of the clicked item as active
                }));
            };

            const stateItem: NavItem = {
                color: colors[navItemIndex % colors.length],
                element: item as HTMLElement,
                id: navItemIndex,
                isActive: false, // Initially not active
                type: 'DEFAULT',
                onClick: handleItemClick, // Store the click handler
            };

            // Check for and store sub-navigation if it exists
            const subNav = item.querySelector('.nav--header-2') as HTMLElement;
            if (subNav) {
                stateItem.childNavigation = subNav;
                stateItem.type = 'PARENT';
            }

            navItemsMap[navItemIndex] = stateItem;
        });

        // Update the component state with discovered items and the root element
        setState((prevState) => ({
            ...prevState,
            navigationItems: navItemsMap,
            root: rootRef.current // Store the root DOM node
        }));

    }, []); // Empty dependency array means this runs once on mount

    // Effect 2: Handle active item change - Trigger animations and update classes
    useEffect(() => {
        // Only run if an activeItem ID is set and the item exists
        if (state.activeItem !== undefined && state.navigationItems[state.activeItem]) {
            const newActiveItem = state.navigationItems[state.activeItem];
            const navLink = newActiveItem.element.querySelector('a.nav__link') as HTMLAnchorElement;

            // Find any previously active item and deactivate it
            const previousActiveItem = Object.values(state.navigationItems).find(item => item.isActive && item.id !== newActiveItem.id);
            if (previousActiveItem) {
                previousActiveItem.element.classList.remove('nav__item--active');
                // Update internal state representation (optional but good practice)
                setState(prevState => ({
                    ...prevState,
                    navigationItems: {
                        ...prevState.navigationItems,
                        [previousActiveItem.id]: { ...previousActiveItem, isActive: false }
                    }
                }));
            }

            // Activate the new item and trigger the transition animation
            if (!newActiveItem.isActive) { // Optional check to prevent re-triggering if already active
                newActiveItem.element.classList.add('nav__item--active');
                // Update internal state representation
                setState(prevState => ({
                    ...prevState,
                    navigationItems: {
                        ...prevState.navigationItems,
                        [newActiveItem.id]: { ...newActiveItem, isActive: true }
                    }
                }));

                // Trigger the animation, passing the target URL if available
                triggerFrontdropTransition(newActiveItem, navLink?.href);
            }
        }
    }, [state.activeItem, state.navigationItems]); // Re-run when activeItem changes or items map updates

    // Effect 3: Attach/Detach Click Listeners
    useEffect(() => {
        const currentNavItems = Object.values(state.navigationItems);

        // Add listeners when items are available/updated
        currentNavItems.forEach((navItem) => {
            if (navItem.element) { // Check if element exists
                navItem.element.addEventListener('click', navItem.onClick);
            }
        });

        // Cleanup function: Remove listeners when component unmounts or items change
        return () => {
            currentNavItems.forEach((navItem) => {
                if (navItem.element) { // Check if element exists before removing
                    navItem.element.removeEventListener('click', navItem.onClick);
                }
            });
        };
    }, [state.navigationItems]); // Dependency array ensures listeners update if items change


    // Effect 4: Intro Animation
    useEffect(() => {
        // Ensure refs are populated before starting animation
        if (!rootRef.current || !itemsRef.current) return;

        // Check if navigationItems are loaded to prevent errors
        if (Object.keys(state.navigationItems).length === 0) return;

        const introAnimation = anime.timeline({
            // Note: Complete callbacks modifying DOM style directly can be fragile.
            // Prefer letting CSS handle final states where possible.
        });

        introAnimation.add({
            duration: 350,
            delay: 1000,
            easing: 'easeOutCirc',
            targets: '.layout__backdrop', // Target backdrop by class
            scaleX: [0, 1],
        })
            .add({
                targets: itemsRef.current.querySelectorAll('.nav--header-1 > .nav__item:not(.nav__item--home)'), // Target list items using ref
                translateY: ['100%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(75),
                duration: 450,
                easing: 'easeOutCirc',
            }, '-=50') // Overlap previous animation slightly
            .add({
                targets: '.layout__backdrop',
                translateX: ['0%', '67%'], // Animate backdrop sideways
                delay: 350,
                easing: 'easeOutExpo',
            })
            // Animate HeroSection elements (ensure HeroSection is rendered and has these classes)
            .add({
                targets: '.hero-title', // Target title by class
                translateY: ['50px', '0px'],
                opacity: [0, 1],
                duration: 350,
                easing: 'easeOutExpo',
            }, '-=200') // Overlap slightly more
            .add({
                targets: '.hero-text', // Target text by class
                translateY: ['30px', '0px'], // Adjusted final Y position
                opacity: [0, 1],
                duration: 350,
                easing: 'easeOutExpo',
            }, '-=100'); // Overlap

        // Cleanup function for the animation
        return () => {
            introAnimation.pause(); // Stop the animation if the component unmounts
            // You might need anime.remove('.selector') here if elements are removed/re-added dynamically
            // For simple unmounts, pause() is usually sufficient.
        };
        // Re-run animation if navigationItems changes (might need adjustment based on desired behavior)
    }, [state.navigationItems, rootRef.current, itemsRef.current]);


    // --- Helper Functions ---

    const triggerFrontdropTransition = (activeItem: NavItem, targetHref?: string) => {
        if (!state.root || !activeItem) return;

        state.root.classList.add('nav--active'); // Add class to root to potentially style main content opacity

        anime.timeline({
            complete: () => { // Cleanup happens once animation finishes
                state.root?.classList.remove('nav--active');
                // Navigate only after animation completes and if targetHref is provided
                if (targetHref) {
                    // Consider using Next.js Router for client-side navigation if available
                    // import { useRouter } from 'next/navigation';
                    // const router = useRouter();
                    // router.push(targetHref);
                    window.location.href = targetHref; // Fallback to full page reload
                }
            }
        })
            .add({
                targets: '.layout__frontdrop',
                backgroundColor: activeItem.color, // Use the item's color
                opacity: [0, 1], // Fade in
                // Consider simplifying: scaleX/translateX might conflict with fixed positioning or other transforms
                // scaleX: [{ value: 0 }, { value: 1 }],
                // translateX: ['270px', '270px'], // Keep it positioned if scaling
                duration: 600, // Adjusted duration
                easing: 'easeOutExpo',
            }, 0) // Start immediately
            .add({
                targets: '.layout__frontdrop',
                opacity: [1, 0], // Fade out
                // scaleX: [{ value: 1 }, { value: 0 }],
                // translateX: ['270px', '0px'], // Animate back if scaling
                duration: 600, // Adjusted duration
                easing: 'easeInCirc', // Use a complementary easing
            }, '+=200'); // Start fade out shortly after fade in finishes
    };


    // --- Render ---
    return (
        // Root layout container
        <div className="layout"  ref={rootRef}>
            {/* Background/Foreground overlay elements for animations */}
            <div className="layout__backdrop"></div>
            <div className="layout__frontdrop"></div>

            {/* Wrapper containing sidebar and main content */}
            <div className="layout__wrapper">

                {/* Sidebar Header - RESPONSIVE HIDING APPLIED HERE */}
                {/* `hidden` = hidden by default (mobile) */}
                {/* `md:block` = display as block from medium breakpoint (768px) upwards */}
                <header className="layout__header">
                    <nav className="h-full"> {/* Ensure nav takes full header height */}
                        {/* Main navigation list */}
                        <ul className="nav flex flex-col nav--header nav--header-1" ref={itemsRef}>
                            <li className="nav__item nav__item--home">
                                <a className="nav__link" href="#0">Home</a>
                            </li>
                            <li className="nav__item nav__item--about">
                                <a className="nav__link" href="#0">About</a>
                            </li>
                            <li className="nav__item nav__item--clients">
                                <a className="nav__link" href="#0">Blog Generator</a>
                                {/* Sub Navigation 1 */}
                                <ul className="nav nav--header nav--header-2">
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Burger King</a>
                                    </li>
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Southwest Airlines</a>
                                    </li>
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Levi Strauss</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav__item nav__item--services">
                                <a className="nav__link" href="#0">Video Generator</a>
                                {/* Sub Navigation 2 */}
                                <ul className="nav nav--header nav--header-2">
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Print Design</a>
                                    </li>
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Web Design</a>
                                    </li>
                                    <li className="nav__item">
                                        <a className="nav__link" href="#0">Mobile App Development</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav__item nav__item--contact">
                                <a className="nav__link" href="#0">Contact</a>
                            </li>
                        </ul>
                    </nav>
                </header>

                {/* Main Content Area - RESPONSIVE PADDING APPLIED HERE */}
                {/* `flex-grow w-full`: Takes remaining width */}
                {/* `md:pl-[300px]`: Adds left padding ONLY when sidebar is visible (md+) */}
                {/*   Adjust '300px' to your actual sidebar width if different     */}


            </div> {/* End layout__wrapper */}
        </div> // End layout
    );
};

export default Navbar;
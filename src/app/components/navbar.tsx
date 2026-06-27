'use client'
import React, { useEffect, useRef, useState } from 'react';
import {createTimeline, stagger} from 'animejs';
import WaterDropGrid from "@/app/components/WaterDropGrid";
import HeroSection from "@/app/components/hero";
import {usePageTransition} from "@/app/components/PageTransition";

interface NavItem {
    color: string;
    element: HTMLElement;
    id: number;
    isActive: boolean;
    type: 'DEFAULT' | 'PARENT';
    childNavigation?: HTMLElement;
    onClick: (event: MouseEvent) => void;
}

interface State {
    navigationItems: Record<number, NavItem>;
    root: HTMLElement | null;
    activeItem?: number;
}

const colors = ['hsla(14, 97%, 65%, 0.4)'];

const Navbar: React.FC = () => {
    const [state, setState] = useState<State>({ navigationItems: {}, root: null, activeItem: undefined });
    const itemsRef = useRef<HTMLUListElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const {navigate} = usePageTransition();

    useEffect(() => {
        if (!itemsRef.current || !rootRef.current) return;

        const items = itemsRef.current.querySelectorAll('.nav--header-1 > .nav__item');
        const navItems: Record<number, NavItem> = {};

        items.forEach((item, navItemIndex) => {
            const navLink = item.querySelector('a.nav__link') as HTMLAnchorElement;
            const handleItemClick = (event: MouseEvent) => {
                event.preventDefault(); // Prevent default link behavior
                setState((prevState) => ({
                    ...prevState,
                    activeItem: navItemIndex
                }));

                if (navLink) {
                    // Pass the route path (raw href attribute) to the transition.
                    triggerFrontdropTransition(
                        state.navigationItems[navItemIndex],
                        navLink.getAttribute('href') ?? undefined,
                    );
                }
            };

            const stateItem: NavItem = {
                color: colors[navItemIndex % colors.length],
                element: item as HTMLElement,
                id: navItemIndex,
                isActive: false,
                type: 'DEFAULT',
                onClick: handleItemClick,
            };

            const subNav = item.querySelector('.nav') as HTMLElement;
            if (subNav) {
                stateItem.childNavigation = subNav;
                stateItem.type = 'PARENT';
            }

            navItems[navItemIndex] = stateItem;
        });

        setState((prevState) => ({
            ...prevState,
            navigationItems: navItems,
            root: rootRef.current as HTMLElement,
        }));
    }, []);

    useEffect(() => {

        if (state.activeItem !== undefined) {
            const previousActiveItem = Object.values(state.navigationItems).find((item) => item.isActive);
            const newActiveItem = state.navigationItems[state.activeItem];
            const navLink = newActiveItem.element.querySelector('a.nav__link') as HTMLAnchorElement;
            const targetHref = navLink?.getAttribute('href') ?? undefined;
            // Remove active class from previous item if it exists
            if (previousActiveItem) {
                previousActiveItem.element.classList.remove('nav__item--active');
                previousActiveItem.isActive = false;
            }

            // Trigger the frontdrop transition for the new active item
            triggerFrontdropTransition(newActiveItem, targetHref);
        }
    }, [state.activeItem]);

    const triggerFrontdropTransition = (activeItem: NavItem, targetHref?: string) => {
        if (!activeItem) return;

        // Mark the clicked item active for styling.
        activeItem.element.classList.add('nav__item--active');
        activeItem.isActive = true;
        setState((prevState) => ({
            ...prevState,
            navigationItems: {
                ...prevState.navigationItems,
                [activeItem.id]: {
                    ...activeItem,
                    isActive: true
                }
            }
        }));

        // The persistent overlay (PageTransition) plays the slide *while* navigating.
        if (targetHref && targetHref.startsWith('/')) {
            navigate(targetHref);
        }
    };

    useEffect(() => {
        Object.values(state.navigationItems).forEach((navItem) => {
            navItem.element.addEventListener('click', navItem.onClick);
        });

        return () => {
            Object.values(state.navigationItems).forEach((navItem) => {
                navItem.element.removeEventListener('click', navItem.onClick);
            });
        };
    }, [state.navigationItems]);

    useEffect(() => {
        const introAnimation = createTimeline({
            onComplete: () => {
                Object.values(state.navigationItems).forEach((navItem) => {
                    navItem.element.addEventListener('click', navItem.onClick);
                    navItem.element.style.transform = '';
                });
            },
        });

        introAnimation.add('.layout__backdrop', {
            duration: 350,
            delay: 1000,
            ease: 'outCirc',
            scaleX: [0, 1],
        }).add('.nav--header-1 > .nav__item:not(.nav__item--home)', {
            delay: stagger(75),
            duration: 450,
            ease: 'outCirc',
            opacity: [0, 1],
            translateY: ['100%', '0%'],
        }).add('.layout__backdrop', {
            ease: 'outExpo',
            translateX: [{ delay: 350, to: '67%' }],
        })
        // .hero-title / .hero-text are animated with framer-motion inside HeroSection
        // (see hero.tsx) so framer-motion owns their transform — animating them here
        // via anime fought the CSS `transform: translateX(3rem)` and caused jitter.

        // Cancel and revert on unmount so Strict Mode's double-invoke (and
        // remounts) don't leave two timelines fighting over the same elements.
        return () => {
            introAnimation.revert();
        };
    }, []);

    return (
        <div className="layout"  ref={rootRef}>
            <div className="layout__backdrop"></div>
            <div className="layout__frontdrop"></div>
            <div className="layout__wrapper">
                <header className="layout__header">
                    <nav>
                        <ul className="nav flex flex-col nav--header nav--header-1" ref={itemsRef}>
                            <li className="nav__item nav__item--home">
                                <a className="nav__link" href="/">Home</a>
                            </li>
                            <li className="nav__item nav__item--about">
                                <a className="nav__link" href="/about">About</a>
                            </li>
                            <li className="nav__item nav__item--clients">
                                <a className="nav__link" href="/blogGenerator">Blog Generator</a>
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
                                <a className="nav__link" href="/videoGenerator">Video Generator</a>
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
                            <li className="nav__item nav__item--login">
                                <a className="nav__link" href="/login">Login</a>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <HeroSection />
                </main>
            </div>
        </div>
    );
};

export default Navbar;
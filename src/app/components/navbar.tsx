'use client'
import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import WaterDropGrid from "@/app/components/WaterDropGrid";
import HeroSection from "@/app/components/hero";
import {router} from "next/client";

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
                    // Pass the target URL to triggerFrontdropTransition
                    triggerFrontdropTransition(state.navigationItems[navItemIndex], navLink.href);
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
            // Remove active class from previous item if it exists
            if (previousActiveItem) {
                previousActiveItem.element.classList.remove('nav__item--active');
                previousActiveItem.isActive = false;
            }

            // Trigger the frontdrop transition for the new active item
            triggerFrontdropTransition(newActiveItem, navLink.href);
        }
    }, [state.activeItem]);

    const triggerFrontdropTransition = (activeItem: NavItem, targetHref?: string) => {
        if (!state.root || !activeItem) return;

        // Animate frontdrop in and then out
        anime.timeline()
            .add({
                targets: '.layout__frontdrop',
                backgroundColor: activeItem.color,
                duration: 800,
                easing: 'easeOutExpo',
                opacity: 1,
                scaleX: [{ value: 0 }, { value: 1 }],
                translateX: [{ value: '270px' }],
                begin: () => state.root?.classList.add('nav--active')
            })
            .add({
                targets: '.layout__frontdrop',
                duration: 800,
                easing: 'easeOutCirc',
                scaleX: [{ value: 1 }, { value: 0 }],
                translateX: [{ value: '0' }],
                complete: () => {
                    state.root?.classList.remove('nav--active');
                    console.log(targetHref);
                    if (targetHref) {
                        window.location.href = targetHref;                  }
                }
            });

        // Set active class for the new active item
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
        const introAnimation = anime.timeline({
            complete: () => {
                Object.values(state.navigationItems).forEach((navItem) => {
                    navItem.element.addEventListener('click', navItem.onClick);
                    navItem.element.style.transform = '';
                });
            },
        });

        introAnimation.add({
            duration: 350,
            delay: 1000,
            easing: 'easeOutCirc',
            targets: '.layout__backdrop',
            scaleX: [0, 1],
        }).add({
            delay: anime.stagger(75),
            duration: 450,
            easing: 'easeOutCirc',
            opacity: [0, 1],
            translateY: ['100%', '0%'],
            targets: '.nav--header-1 > .nav__item:not(.nav__item--home)',
        }).add({
            easing: 'easeOutExpo',
            targets: '.layout__backdrop',
            translateX: [{ delay: 350, value: '67%' }],
        }).add({
            duration: 350,
            easing: 'easeOutExpo',
            targets: '.hero-title',
            opacity: [0, 1],
            translateY: ['50px', '0'],
            complete: () => {
                // Clean up the transform style to let CSS take effect
                const heroTitle = document.querySelector('.hero-title') as HTMLElement;
                if (heroTitle) heroTitle.style.transform = '';
            }
        }).add({
            duration: 350,
            easing: 'easeOutExpo',
            targets: '.hero-text',
            opacity: [0, 1],
            translateY: ['30px', '-3rem'],
            complete: () => {
                // Clean up the transform style to let CSS take effect
                const heroText = document.querySelector('.hero-text') as HTMLElement;
                if (heroText) heroText.style.transform = '';
            }
        }, '-=100')
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
                                <a className="nav__link" href="#0">Home</a>
                            </li>
                            <li className="nav__item nav__item--about">
                                <a className="nav__link" href="#0">About</a>
                            </li>
                            <li className="nav__item nav__item--clients">
                                <a className="nav__link" href="#0">Blog Generator</a>
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
                <main>
                    <HeroSection />
                </main>
            </div>
        </div>
    );
};

export default Navbar;
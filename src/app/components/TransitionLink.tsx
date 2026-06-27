'use client'
import React from 'react';
import {usePageTransition} from '@/app/components/PageTransition';

interface TransitionLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

/** A link that triggers the page-transition wipe instead of an instant jump. */
export default function TransitionLink({href, className, children}: TransitionLinkProps) {
    const {navigate} = usePageTransition();
    return (
        <a
            href={href}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                navigate(href);
            }}
        >
            {children}
        </a>
    );
}

import React, {useEffect, useRef} from 'react';
import {motion, useAnimation} from 'framer-motion';
import anime from 'animejs';

interface AnimatedInputProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
    name?: string;
    submitRef?: React.RefObject<HTMLInputElement>;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({value, className, style, name, submitRef}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const controls = useAnimation();
    const intervalIdRef = useRef<number | null>(null);

    const resetInput = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        if (inputRef.current) {
            inputRef.current.value = ''; // Clear the input value
        }
    };

    const animateInput = () => {
        if (inputRef.current) {
            const chars = value.split('');
            let currentIndex = 0;
            inputRef.current.value = ''; // Reset the value before animating
            const intervalId = window.setInterval(() => {
                if (currentIndex < chars.length && inputRef.current) {
                    inputRef.current.value += chars[currentIndex];
                    currentIndex += 1;
                } else {
                    if (intervalIdRef.current) {
                        clearInterval(intervalIdRef.current);
                        intervalIdRef.current = null;
                    }
                    // Trigger the second animation on submitRef
                    if (submitRef?.current) {
                        const animation = anime.timeline({duration: 500});
                        animation.add({
                            targets: submitRef.current,
                            scale: 0.75,
                            backgroundColor: '#fff',
                            duration: 1000,
                        });
                        animation.add({
                            targets: submitRef.current,
                            scale: 1,
                            backgroundColor: '#EC4899',
                            duration: 1000,
                        });
                    }
                }
            }, 100);

            intervalIdRef.current = intervalId;

            controls.start({
                opacity: 1,
                transition: {duration: 0.5},
            });

        }
    };

    return (
        <motion.input
            ref={inputRef}
            name={name}
            readOnly
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            onViewportEnter={() => {
                resetInput();
                animateInput();
            }}
            onViewportLeave={() => {
                resetInput();
                controls.start({opacity: 0, transition: {duration: 0.5}});
            }}
            viewport={{once: false, amount: 'some'}}
            animate={controls}
            className={`text-black ${className || ''}`}
            style={style}
        />
    );
};

export default AnimatedInput;